import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Accessible dialog (focus trap, Escape to close) built on Radix.
 * @param {{ open: boolean, onClose: () => void, title: string, description?: string, footer?: import('react').ReactNode, wide?: boolean }} props
 */
export default function Modal({ open, onClose, title, description, children, footer, wide = false }) {
    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50" />
                <Dialog.Content
                    className={`fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col  bg-white  focus:outline-none ${
                        wide ? 'max-w-2xl' : 'max-w-lg'
                    }`}
                >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                        <div>
                            <Dialog.Title className="text-base font-semibold text-slate-900">{title}</Dialog.Title>
                            <Dialog.Description className={description ? 'mt-1 text-sm text-slate-500' : 'sr-only'}>
                                {description ?? title}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
                            <X className="h-5 w-5" />
                        </Dialog.Close>
                    </div>
                    <div className="overflow-y-auto px-5 py-4">{children}</div>
                    {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">{footer}</div>}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, processing = false }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={processing}>
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-slate-600">{message}</p>
        </Modal>
    );
}
