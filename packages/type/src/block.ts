import { ILeaferBase, IWheelConfig, ITouchConfig } from '@leafer/interface'


export function block(leafer: ILeaferBase): void {
    const { config } = leafer;
    (config.wheel || (config.wheel = {}) as IWheelConfig).preventDefault = false;
    (config.touch || (config.touch = {}) as ITouchConfig).preventDefault = 'auto'
}
