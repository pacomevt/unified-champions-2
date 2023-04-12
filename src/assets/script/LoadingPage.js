


export class LoadingPage {
    constructor(container) {
        this.container = {
            elem : container,
            box : null
        };
        this.init();
    }

    init() {
        console.log('init loading page');
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.elem.offsetWidth;
        this.canvas.height = this.container.elem.offsetHeight;
        this.container.elem.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }
}


class Particle {
    
}