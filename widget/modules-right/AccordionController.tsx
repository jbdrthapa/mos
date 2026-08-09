export class AccordionController {
    private listeners: Array<(id: string) => void> = [];

    register(id: string, callback: (id: string) => void) {
        this.listeners.push(callback);
    }

    open(id: string) {
        for (const cb of this.listeners) {
            cb(id);
        }
    }
}