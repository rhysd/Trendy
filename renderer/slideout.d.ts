declare module SlideoutStatic {
    interface Option {
        panel: HTMLElement;
        menu: HTMLElement;
        duration?: number;
        fx?: string;
        padding?: number;
        tolerance?: number;
        touch?: boolean;
        side?: string;
    }

    export class Slideout {
        constructor(Option);
        open(): void;
        close(): void;
        toggle(): void;
        isOpen(): boolean;
        destroy(): void;
        enableTouch(): void;
        disableTouch(): void;

        on(event: string, listener: Function): Slideout;
        once(event: string, listener: Function): Slideout;
        off(event: string, listener: Function): Slideout;
        emit(event: string, ...args: any[]): Slideout;
    }
}

declare module 'slideout' {
    var s: typeof SlideoutStatic.Slideout;
    export = s;
}
