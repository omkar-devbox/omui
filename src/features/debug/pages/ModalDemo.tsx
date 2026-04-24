import React from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useModal,
  Button
} from '../../../shared/ui';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export const ModalDemo: React.FC = () => {
  const { isOpen: isDeleteOpen, openModal: openDelete, closeModal: closeDelete } = useModal();
  const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal();
  const { isOpen: isSizeOpen, openModal: openSize, closeModal: closeSize } = useModal();
  
  const [modalSize, setModalSize] = React.useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

  const handleOpenSize = (size: 'sm' | 'md' | 'lg' | 'xl' | 'full') => {
    setModalSize(size);
    openSize();
  };

  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-[#0b0f1a] min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Modals & Dialogs</h2>
        
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium italic mb-4">
              Premium, accessible dialog system with Framer Motion animations.
            </p>
            
            <div className="flex flex-wrap gap-4">
              {/* Confirmation Modal Trigger */}
              <Button variant="danger" onClick={openDelete}>
                Delete Item Confirmation
              </Button>

              {/* Form Modal Trigger */}
              <Button variant="primary" onClick={openForm}>
                New Project Form
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">Size Variants</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenSize('sm')}>Small (sm)</Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenSize('md')}>Medium (md)</Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenSize('lg')}>Large (lg)</Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenSize('xl')}>Extra Large (xl)</Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenSize('full')}>Full Screen</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Confirmation Modal */}
      <Modal open={isDeleteOpen} onClose={closeDelete} size="sm">
        <ModalHeader 
          title="Delete Project" 
          description="This action cannot be undone."
          icon={<div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><AlertCircle className="text-red-600 dark:text-red-400 h-5 w-5" /></div>}
        />
        <ModalBody>
          Are you sure you want to delete the project <span className="font-semibold text-gray-900 dark:text-white">&quot;Modern SaaS UI&quot;</span>? 
          All associated data will be permanently removed from our servers.
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={closeDelete}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            alert('Deleted!');
            closeDelete();
          }}>
            Yes, Delete Project
          </Button>
        </ModalFooter>
      </Modal>

      {/* 2. Form Modal */}
      <Modal open={isFormOpen} onClose={closeForm} size="md">
        <ModalHeader 
          title="Create New Project" 
          description="Fill in the details below to get started."
          icon={<div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg"><CheckCircle className="text-emerald-600 dark:text-emerald-400 h-5 w-5" /></div>}
        />
        <ModalBody>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="e.g. My Awesome App"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white h-28 resize-none"
                placeholder="What is this project about?"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={closeForm}>Cancel</Button>
          <Button variant="primary">Create Project</Button>
        </ModalFooter>
      </Modal>

      {/* 3. Dynamic Size Modal */}
      <Modal open={isSizeOpen} onClose={closeSize} size={modalSize}>
        <ModalHeader 
          title={`Modal Size: ${modalSize.toUpperCase()}`}
          icon={<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Info className="text-blue-600 dark:text-blue-400 h-5 w-5" /></div>}
        />
        <ModalBody>
          <p className="mb-6 text-gray-600 dark:text-gray-400">This modal is currently using the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">{modalSize}</code> size variant.</p>
          <div className="h-[250px] bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <span className="text-gray-400 dark:text-gray-500 font-medium">Content Area Visualization</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={closeSize}>Got it, Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

