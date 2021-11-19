import { Speed } from "../components/AlgoSimPlayer";

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
    dt: number;

    constructor(cb?: () => void) {
        this.delay = Speed.FAST;
        this.intvl = this.delay * 1000;

        this.expected = 1000;
        this.timer_instance = 0;
        this.stop_requested = false;
        this.dt = 0;

        if (cb) {
            this.callback = cb;
        }

        this.step = this.step.bind(this);
        this.set_instance = this.set_instance.bind(this);
    }

    private step() {
        function steppy(interval: number, expected: number, stop_requested: boolean, timer_instance: number, cb: () => void ) {
            if (stop_requested) {
                window.clearTimeout(timer_instance);

                return;
            }
            let dt = Date.now() - expected; // the drift (positive for overshooting)
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
            cb && cb();

            expected += interval;

            if (interval < dt) console.log("diff too high wtf");
            return dt;
        }

        this.timer_instance = window.setTimeout(() => {steppy(this.delay, this.expected, this.stop_requested, this.timer_instance, this.tsty)}, Math.max(0, this.intvl - this.dt)); // take into account drift
    }

    public set_callback(cb: () => void): void {
        this.callback = cb;
    }

    public set_instance(timer: number) {
        this.timer_instance = timer;
    }

    private tsty()
    {
        console.log(this);
    }


    public start_timer(): void {
        console.log("STARTING TIME");
        this.expected = Date.now() + this.intvl;
        this.timer_instance = window.setTimeout(this.step, this.intvl);
    }

    public stop_timer(): void {
        window.clearTimeout(this.timer_instance);
        this.stop_requested = true;
    }
}
