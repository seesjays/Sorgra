import { Speed } from "../components/AlgoSimPlayer";

/*
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

*/

interface IOldtimey {
    delay: Speed;
    expected: number;
    timer_instance: number;
    callback?(): void;
}

export class Oldtimey implements IOldtimey {
    delay: Speed;
    intvl: number;
    expected: number;

    timer_instance: number;
    stop_requested: boolean;

    callback?(): void;

    constructor(cb?: () => void)
    {
        this.delay = Speed.FAST;
        this.intvl = this.delay*1000;

        this.expected = 1000;
        this.timer_instance = 0;
        this.stop_requested = false;

        if (cb)
        {
            this.callback = cb;
        }

        this.step = this.step.bind(this);
    }

    private step() {
        if (this.stop_requested)
        {
            window.clearTimeout(this.timer_instance);

            return;
        }
        let dt = Date.now() - this.expected; // the drift (positive for overshooting)
        /*
        if (dt > this.delay*1000) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
            console.log("terrible timing");
            this.stop_timer();
            return;
        }
        */
       
        //… // do what is to be done
        this.callback && this.callback();
    
        this.expected += this.intvl;
        
        if (this.intvl < dt) console.log("diff too high wtf");

        this.timer_instance = window.setTimeout(this.step, Math.max(0, this.intvl - dt)); // take into account drift
    }

    public set_callback(cb: () => void):void {
        this.callback = cb;
    }


    public start_timer(): void {
        console.log("STARTING TIME")
        this.expected = Date.now() + this.intvl;
        this.timer_instance = window.setTimeout(this.step, this.intvl);
    }

    public stop_timer(): void {
        window.clearTimeout(this.timer_instance);
        this.stop_requested = true;
    }
}
