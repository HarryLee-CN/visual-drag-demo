import store from './index'
import { deepCopy } from '@/utils/utils'
import toast from '@/utils/toast'

export default {
    state: {
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引
    },
    mutations: {
        undo(state) {
            if (state.snapshotIndex >= 0) {
                state.snapshotIndex--
                /** 避免过度撤销，导致编辑器空白 * */
                if (!state.snapshotData[state.snapshotIndex]) {
                    toast('无法撤销了', 'warning')
                    state.snapshotIndex++
                    return
                }
                store.commit('setComponentData', deepCopy(state.snapshotData[state.snapshotIndex]))
            }
        },

        redo(state) {
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotIndex++
                store.commit('setComponentData', deepCopy(state.snapshotData[state.snapshotIndex]))
            } else {
                /** 无法重做时，给予提示 * */
                toast('无法重做了', 'warning')
            }
        },

        recordSnapshot(state) {
            // 添加新的快照
            state.snapshotData[++state.snapshotIndex] = deepCopy(state.componentData)
            // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
            }
        },
    },
}
