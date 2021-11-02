import { Speed } from "../components/AlgoSimPlayer";

var interval = 1000; // ms
var expected = Date.now() + interval;
setTimeout(step, interval);
function step() {
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
        // something really bad happened. Maybe the browser (tab) was inactive?
        // possibly special handling to avoid futile "catch up" run
    }
    //… // do what is to be done

    expected += interval;
    setTimeout(step, Math.max(0, interval - dt)); // take into account drift
}


interface IOldtimey {
    delay: Speed;
    expected: number;
    time_instance: number;
    callback?(): void;
}

export class Oldtimey implements IOldtimey {
    delay: Speed;
    expected: number;
    time_instance: number;
    callback?(): void;

    constructor(cb?: () => void)
    {
        this.delay = Speed.FAST;
        this.expected = 1000;
        this.time_instance = 0;
        if (cb)
        {
            this.callback = cb;
        }
    }

    public set_callback():void {

    }


    public start_timer(): void {

    }

    public stop_timer(): void {

    }
}
