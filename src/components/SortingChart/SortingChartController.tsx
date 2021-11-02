import React from "react";
import { SortingOperationController } from "../../scripts/dataset";
import { SortingChartContainer } from "./SortingChartContainer";

type SortingChartControllerProps = {
    step: number;
    step_controller: SortingOperationController;
    running: boolean;
};

export const SortingChartController = (
	{step_controller}: SortingChartControllerProps
) => {
    let init_data = step_controller.get_chart_dataset();

    const time = React.useRef(1000);

    const [step, set_step] = React.useState(init_data);
    const [timer_instance, set_timer_instance] = React.useState<number | undefined>(undefined);

    const [nxt, set_nxt] = React.useState<number | undefined>(undefined);

    const next_step = React.useCallback(() => {


    }, []);

    const next_step_time = React.useCallback((nu_nxt) => {

    }, [time]);

    React.useEffect(() => {
        if (nxt === undefined)
        {
            return;
        }

        
        
        // next_step_time()
    }, [nxt])



	return <SortingChartContainer chart_data={step} />;
};
