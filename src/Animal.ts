export default class Animal {
  constructor(public name: string) {
    console.log("Create an animal");
  }
  private onPress: (() => void) | undefined = undefined;
  onPush(cb: () => void) {
    this.onPress = cb;
    this.onPress();
  }
}
