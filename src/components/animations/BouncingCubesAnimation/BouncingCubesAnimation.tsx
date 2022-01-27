import {FC} from "react";
import Lottie from "react-lottie";
import * as animationData from "@util/lottie/86284-bouncing-shapes.json";

export interface BouncingCubesAnimationProps {
}

const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const BouncingCubesAnimation: FC<BouncingCubesAnimationProps> = ({}) => {
    return <Lottie isClickToPauseDisabled={true} options={lottieOptions} height={250} width={200}/>;
};

export default BouncingCubesAnimation;


