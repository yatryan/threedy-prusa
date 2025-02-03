import React from 'react';
import {HomeAssistant, ThreedyCondition, ThreedyConfig} from "../../types";
import TemperatureStat from "./TemperatureStat";
import { getEntity } from '../../Utils/HomeAssistant';
import Stat from "./Stat";
import TimeStat from "./TimeStat";


/*


    const entityEnding = (() => {
        switch (condition) {
            case 'Status':
                return config.use_mqtt ? '_print_status' : '_current_state'
            case 'ETA':
                return config.use_mqtt ? '_print_time_left' : '_time_remaining'
            case 'Elapsed':
                return config.use_mqtt ? '_print_time' : '_time_elapsed'
            case 'Hotend':
                return config.use_mqtt ? '_tool_0_temperature' : '_actual_tool0_temp'
            case 'Bed':
                return config.use_mqtt ? '_bed_temperature' : '_actual_bed_temp'
            default:
                return undefined
        }
    })();


 */


/**
 * Function to dynamically render a stat by determining what type of stat it is
 * @param hass
 * @param config
 * @param condition
 */
const renderCondition = (
    hass: HomeAssistant,
    config: ThreedyConfig,
    condition: ThreedyCondition | string
) => {

    const entity = (suffix: string) => getEntity(hass, `${config.base_entity}${suffix}`);
    const mqtt = config.use_mqtt;

    switch (condition) {
        case ThreedyCondition.Status:
            return (
                <Stat
                    name={"Status"}
                    value={ entity('').state }
                />
            )
        case ThreedyCondition.ETA:
            return (
                <TimeStat
                    timeEntity={ entity( '_print_finish' ) }
                    condition={condition}
                    config={config}
                    direction={0}
                />
            )
        case ThreedyCondition.Elapsed:
            return (
                <TimeStat
                    timeEntity={ entity( '_print_start' ) }
                    condition={condition}
                    config={config}
                    direction={1}
                />
            )

        case ThreedyCondition.Remaining:
            return (
                <TimeStat
                    timeEntity={ entity( '_time_remaining' ) } // tODO
                    condition={condition}
                    config={config}
                    direction={-1}
                />
            )

        case ThreedyCondition.Bed:
            return (
                <TemperatureStat
                    name={"Bed"}
                    temperatureEntity={ entity( '_heatbed_temperature' ) }
                    config={config}
                />
            )

        case ThreedyCondition.Hotend:
            return (
                <TemperatureStat
                    name={"Hotend"}
                    temperatureEntity={ entity( '_nozzle_temperature' ) }
                    config={config}
                />
            )


        default:
            return (
                <Stat
                    name={"Unknown"}
                    value={"<unknown>"}
                />
            )

    }

}

/**
 * Function to render all stats
 * @param hass
 * @param config
 */
const renderStats = (
    hass: HomeAssistant,
    config: ThreedyConfig
) => {

    return config.monitored.map(
        condition => renderCondition( hass, config, condition )
    )

}

const percentComplete = (
    hass: HomeAssistant,
    config: ThreedyConfig
) => {
    return (hass.states[`${config.base_entity}_progress`] || { state: -1.0 }).state;
}

export {
    renderStats,
    percentComplete
}
