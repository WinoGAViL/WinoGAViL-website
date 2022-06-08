export enum ExperimentModeEnum {
    RG = 'RG',
    ONLY_AI = 'OA',
    ONLY_HUMAN = 'OH',
    NO_REWARD = 'NR',
    DEFAULT = 'DEFAULT'
}

export function get_experiment_mode(mode): ExperimentModeEnum {
    mode = mode?.toUpperCase()
    switch (mode) {
        case ExperimentModeEnum.RG:
            return ExperimentModeEnum.RG;
        case ExperimentModeEnum.ONLY_AI:
            return ExperimentModeEnum.ONLY_AI;
        case ExperimentModeEnum.ONLY_HUMAN:
            return ExperimentModeEnum.ONLY_HUMAN
        case ExperimentModeEnum.NO_REWARD:
            return ExperimentModeEnum.NO_REWARD
        default:
            return ExperimentModeEnum.DEFAULT
    }
}

