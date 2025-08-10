'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGlobalData, type RolePermissions } from '@/context/GlobalDataContext';
import { useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const PERMISSIONS: Array<{ key: keyof RolePermissions['Admin']; label: string; hint?: string }> = [
  { key: 'viewManageTeam', label: 'Manage Users & Teams' },
  { key: 'financials', label: 'View Financials' },
  { key: 'deleteExport', label: 'Delete or Export Data' },
  { key: 'highLevelSettings', label: 'Access High-level Settings' },
  { key: 'editData', label: 'Edit Records' },
  { key: 'viewData', label: 'View Records' },
];

const ROLES: Array<'Admin' | 'Standard User' | 'Viewer'> = ['Admin', 'Standard User', 'Viewer'];

export function RolesSettings() {
  const { toast } = useToast();
  const { userProfile, getWorkspaceRolePermissions, setWorkspaceRolePermissions } = useGlobalData();

  const workspaceKey = useMemo(() => {
    if (userProfile?.authRole === 'lawyer' && (userProfile as any).firmName) return (userProfile as any).firmName as string;
    if (userProfile?.authRole === 'superadmin') return 'superadmin';
    return 'platform';
  }, [userProfile]);

  // Gate: Only Admins (lawyer Admin) and Super Admin can modify
  const isAdmin = (userProfile?.authRole === 'superadmin') ||
    (userProfile?.authRole === 'lawyer' && (userProfile as any).accessLevel === 'Admin');

  const [localPerms, setLocalPerms] = useState<RolePermissions>(() => getWorkspaceRolePermissions(workspaceKey));

  const toggle = (role: keyof RolePermissions, perm: keyof RolePermissions['Admin']) => {
    setLocalPerms(curr => {
      const currentVal = curr[role][perm];
      let nextVal: boolean | 'view-only' = false;
      if (perm === 'viewManageTeam' && role === 'Viewer') {
        // viewers are view-only
        nextVal = currentVal === 'view-only' ? false : 'view-only';
      } else if (currentVal === true) {
        nextVal = false;
      } else {
        nextVal = true;
      }
      return { ...curr, [role]: { ...curr[role], [perm]: nextVal } };
    });
  };

  const handleSave = () => {
    setWorkspaceRolePermissions(workspaceKey, localPerms);
    toast({ title: 'Permissions Saved', description: 'Role permissions have been updated for this workspace.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Access</CardTitle>
        <CardDescription>
          Define what each role can do in this workspace. Changes here affect only this workspace/portal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isAdmin && (
          <div className="text-sm text-muted-foreground">Only Admins can modify role permissions.</div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4">Permission</th>
                {ROLES.map(r => (
                  <th key={r} className="text-center py-2 px-2">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(p => (
                <tr key={p.key} className="border-t">
                  <td className="py-2 pr-4">
                    <div className="font-medium">{p.label}</div>
                    {p.hint && <div className="text-xs text-muted-foreground">{p.hint}</div>}
                  </td>
                  {ROLES.map(r => (
                    <td key={r} className="text-center py-2 px-2">
                      {p.key === 'viewManageTeam' && r === 'Viewer' ? (
                        <span className="text-xs text-muted-foreground">
                          {localPerms[r][p.key] === 'view-only' ? 'View only' : 'No access'}
                        </span>
                      ) : (
                        <Switch
                          checked={localPerms[r][p.key] === true}
                          onCheckedChange={() => isAdmin && toggle(r, p.key)}
                          disabled={!isAdmin}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={handleSave} disabled={!isAdmin}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
