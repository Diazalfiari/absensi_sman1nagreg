import React, { useState, useMemo } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const EditWaliKelasModal = ({ isOpen, onClose, onSave, allTeachers, currentWaliKelas }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherName, setSelectedTeacherName] = useState(currentWaliKelas || '');

  // Filter teachers based on search query
  const filteredTeachers = useMemo(() => {
    if (!allTeachers) return [];
    
    // Sort all teachers by name
    let sorted = [...allTeachers].sort((a, b) => a.nama.localeCompare(b.nama));
    
    if (!searchQuery.trim()) return sorted;
    
    const query = searchQuery.toLowerCase();
    return sorted.filter(t => 
      t.nama.toLowerCase().includes(query) || 
      (t.nip && t.nip.toLowerCase().includes(query))
    );
  }, [allTeachers, searchQuery]);

  const handleSave = () => {
    if (selectedTeacherName !== currentWaliKelas) {
      onSave(selectedTeacherName);
    }
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedTeacherName(currentWaliKelas || '');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ubah Wali Kelas"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Cari Guru</label>
          <input
            type="text"
            placeholder="Cari nama atau NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-zinc-600"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Pilih Guru</label>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map(teacher => {
                const isSelected = selectedTeacherName === teacher.nama;
                
                return (
                  <div 
                    key={teacher.id}
                    onClick={() => setSelectedTeacherName(teacher.nama)}
                    className={`flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer border ${
                      isSelected 
                        ? 'bg-primary-500/10 border-primary-500/30' 
                        : 'hover:bg-zinc-800 border-transparent'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-zinc-200 text-sm">{teacher.nama}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{teacher.nip || '-'}</div>
                    </div>
                    <div className="text-xs">
                      {isSelected && (
                        <span className="text-primary-400 font-medium">Terpilih</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-zinc-500 text-sm">
                Guru tidak ditemukan.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={handleSave}
            disabled={!selectedTeacherName || selectedTeacherName === currentWaliKelas}
          >
            Simpan Wali Kelas
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditWaliKelasModal;
