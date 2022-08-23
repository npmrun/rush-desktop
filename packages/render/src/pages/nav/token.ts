import { INiuTreeData, INiuTreeKey } from "princess-ui";
import { InjectionKey } from "vue";

export type TState = {
    activeKeys: INiuTreeKey[],
    openKey?: INiuTreeKey,
    focusKey?: INiuTreeKey,
    isFocus?: boolean,
    list: INiuTreeData[]
}

export const IState: InjectionKey<TState> = Symbol()
