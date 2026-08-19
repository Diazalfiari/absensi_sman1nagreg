import React, { useState, useMemo } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const AddStudentModal = ({ isOpen, onClose, onAdd, allStudents, currentClassId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!allStudents) return [];
    
    // Sort all students by name
    let sorted = [...allStudents].sort((a, b) => a.nama.localeCompare(b.nama));
    
    if (!searchQuery.trim()) return sorted;
    
    const query = searchQuery.toLowerCase();
    return sorted.filter(s => 
      s.nama.toLowerCase().includes(query) || 
      (s.nipd && s.nipd.toLowerCase().includes(query))
    );
  }, [allStudents, searchQuery]);

  const handleAdd = () => {
    if (!selectedStudentId) return;
    
    const student = allStudents.find(s => s.id.toString() === selectedStudentId.toString());
    if (student) {
      onAdd(student);
      setSelectedStudentId('');
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedStudentId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={"Tambah Siswa ke " + currentClassId}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Cari Siswa</label>
          <input
            type="text"
            placeholder="Cari nama atau NIPD/NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-zinc-600"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Pilih Siswa</label>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => {
                const isAlreadyInClass = student.kelas === currentClassId;
                const isSelected = selectedStudentId === student.id.toString();
                
                return (
                  <div 
                    key={student.id}
                    onClick={() => !isAlreadyInClass && setSelectedStudentId(student.id.toString())}
                    className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                      isAlreadyInClass 
                        ? 'opacity-50 cursor-not-allowed bg-zinc-900/50' 
                        : isSelected 
                          ? 'bg-primary-500/10 border-primary-500/30 cursor-pointer border' 
                          : 'hover:bg-zinc-800 cursor-pointer border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-zinc-200 text-sm">{student.nama}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{student.nipd || '-'}</div>
                    </div>
                    <div className="text-xs">
                      {isAlreadyInClass ? (
                        <span className="text-zinc-500">Sudah di kelas ini</span>
                      ) : student.kelas ? (
                        <span className="text-amber-500/80">Kelas: {student.kelas}</span>
                      ) : (
                        <span className="text-emerald-500/80">Belum ada kelas</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-zinc-500 text-sm">
                Siswa tidak ditemukan.
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
            onClick={handleAdd}
            disabled={!selectedStudentId}
          >
            Tambah Siswa
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
