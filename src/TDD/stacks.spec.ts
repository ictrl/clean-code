class Stack {
    size = 0;
    stack = [];
    push(element) {
        this.stack.push(element)
        this.size++;
    }

    pop() {
        if(this.size <= 0) throw new Error('Stack underflow')
        else {this.stack.pop()
        this.size--;
        }
    }
}


describe('Stack', () => {
    let stack;
    beforeEach(() => {
        stack = new Stack();
    })

    it('Stack is defined', () => {
        expect(stack).toBeDefined()
    })

    it('new stack should be empty', () => {
        expect(stack.size).toBe(0);
    })

    it('push to new stack and size should be increate to 1', () => {
        stack.push(0);
        expect(stack.size).toBe(1);
    });

    it('pop to stack should reduce the size', () => {
        stack.push(1)
        let size = stack.size;
        stack.pop();
        expect(size - 1).toBe(stack.size)
    })

    it('pop to single element stack should have empty stack', () => {
        stack.push(0);
        let size = stack.size;
        stack.pop()
        expect(size - 1).toBe(stack.size)
        expect(stack.stack).toEqual([])
    })

    it('pop an empty stack should throw underflow error', ()=> {
        expect(() => stack.pop()).toThrow('Stack underflow')
        expect(stack.size).toBe(0)
        expect(stack.stack).toEqual([])
    })
})
//todo continue with TDD and clean code