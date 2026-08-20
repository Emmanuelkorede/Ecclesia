import { useState } from 'react';
import { useGroups } from '../../hooks/useGoups';
import GroupCard from '../../components/groups/groupCard';
import GroupMembersModal from '../../components/groups/groupMembersModal';
import PlanLimitBanner from '../../components/billing/planLimitBanner';
import { Plus, X, AlertCircle } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import type { GroupWithDetails } from '../../services/groupServives';

export default function GroupsPage() {
  const { groups, loading, createGroup, updateGroup, deleteGroup } = useGroups();
  const [showForm, setShowForm] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<GroupWithDetails | null>(null);
  const [viewingMembersFor, setViewingMembersFor] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingGroupId(null);
    setName('');
    setDescription('');
    setShowForm(true);
  };

  const openEdit = (group: GroupWithDetails) => {
    setEditingGroupId(group.id);
    setName(group.name);
    setDescription(group.description ?? '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editingGroupId) {
        await updateGroup(editingGroupId, { name, description: description || null });
      } else {
        await createGroup(name, description || undefined);
      }
      setShowForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving the group.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteGroup(groupToDelete.id);
      setGroupToDelete(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete group.';
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-5 pb-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-main tracking-tight">Groups</h1>
          <p className="text-muted mt-1 text-sm">
            Manage ministries, teams, and small groups.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Group</span>
        </button>
      </div>

      <PlanLimitBanner currentCount={groups.length} metric="groups" />

      {error && !showForm && !groupToDelete && (
        <div className="flex items-start gap-2 p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Modal Overlay for Create / Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-subtle bg-app/50">
              <h2 className="text-base font-semibold text-main">
                {editingGroupId ? 'Edit Group' : 'Create Group'}
              </h2>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="p-1.5 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {error && (
                <div className="flex items-start gap-2 p-3 mb-4 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-main mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Choir"
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-main mb-1">
                    Description <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-app border border-subtle rounded-lg text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="text-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingGroupId ? 'Save changes' : 'Create group'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay for Delete Confirmation */}
      {groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-xl border border-subtle overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-subtle bg-app/50">
              <h2 className="text-base font-semibold text-main">Delete Group</h2>
              <button 
                type="button" 
                onClick={() => setGroupToDelete(null)}
                className="p-1.5 text-muted hover:text-main hover:bg-surface rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                Are you sure you want to delete &quot;<span className="text-main font-medium">{groupToDelete.name}</span>&quot;? This action cannot be undone.
              </p>
              
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGroupToDelete(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-main border border-subtle text-sm font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Yes, delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content List / Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted">
          <Spinner size="md" className="text-brand-500 mb-3" />
          <p className="text-sm font-medium">Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="py-8 px-4 text-center rounded-xl border border-dashed border-subtle bg-surface/50">
          <p className="text-xs text-muted">No groups yet — create your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <div 
              key={g.id} 
              onClick={() => setViewingMembersFor({ id: g.id, name: g.name })} 
              className="cursor-pointer"
            >
              <GroupCard
                name={g.name}
                description={g.description}
                leaderName={g.leader_name}
                memberCount={g.member_count}
                onDelete={(e) => { 
                  e.stopPropagation(); 
                  setGroupToDelete(g); 
                }}
                onEdit={(e) => { 
                  e.stopPropagation(); 
                  openEdit(g); 
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal for Viewing Members */}
      {viewingMembersFor && (
        <GroupMembersModal
          groupId={viewingMembersFor.id}
          groupName={viewingMembersFor.name}
          onClose={() => setViewingMembersFor(null)}
        />
      )}
    </div>
  );
}