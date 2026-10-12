export class InputHandler {
    private keys: Set<string> = new Set();

    constructor() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys.delete(e.code);
        });
    }

    public isKeyPressed(keyCode: string): boolean {
        return this.keys.has(keyCode);
    }
}