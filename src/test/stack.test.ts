class Stack {
    top: number;
    items: string[];

    constructor() {
        this.top = -1;
        this.items = [];
    }
    push(item: string) {
        this.top++;
        this.items.push(item);
    }

    pop() {
        if (this.top <= -1) return
        this.top--;
        this.items.pop();
    }
}


describe('My Stack', () => {
    let stack: Stack;
    beforeEach(() => {
        stack = new Stack();
    })
    it('Create empty stack', () => {
        expect(stack).toBeDefined();
        expect(stack.top).toBe(-1);
    });
    it('Add item to top', () => {
        const item = '🚀';
        stack.push(item);
        expect(stack.top).toBe(0);
        expect(stack.items[0]).toBe(item);
        expect(stack.items).toEqual([item]);

    });
    it('Remove item from top', () => {
        const item = '🚀';
        stack.push(item);

        stack.pop();
        expect(stack.top).toBe(-1);
        expect(stack.items).toEqual([])
    });

    it('Remove item from empty stack', () => {
        stack.pop();
        expect(stack.top).toBe(-1);
        expect(stack.items).toEqual([])
    });
});