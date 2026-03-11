export interface DragVerifyActionType {
  resume: () => void;
}

export interface MoveData {
  event: MouseEvent | TouchEvent;
  moveDistance: number;
  moveX: number;
}
