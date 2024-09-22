// ModalController.ts
class ModalController {
  private static instance: ModalController;
  private modalStack: (() => void)[];
  private handleKeyDown: (event: KeyboardEvent) => void;

  private constructor() {
    this.modalStack = [];
    this.handleKeyDown = this.onKeyDown.bind(this);

    document.addEventListener('keydown', this.handleKeyDown);
  }

  public static getInstance(): ModalController {
    if (!ModalController.instance) {
      ModalController.instance = new ModalController();
    }
    return ModalController.instance;
  }

  public registerModal(onCloseCallback: () => void): void {
    this.modalStack.push(onCloseCallback);
  }

  public unregisterModal(onCloseCallback: () => void): void {
    this.modalStack = this.modalStack.filter((el) => el !== onCloseCallback);
  }

  public closeTopModal(): void {
    const topCallback = this.modalStack.pop();
    console.log('this.modalStack', this.modalStack);
    if (topCallback) {
      topCallback();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeTopModal();
    }
  }
}

const modalController = ModalController.getInstance();
export default modalController;
