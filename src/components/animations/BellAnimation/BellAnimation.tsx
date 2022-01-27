import {FC} from "react";
import * as animationData from "@util/lottie/67089-bell-alert.json";
import Lottie from "react-lottie";

export interface BellAnimationProps {
}

const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const BellAnimation: FC<BellAnimationProps> = ({}) => {
    return <Lottie isClickToPauseDisabled={true} options={lottieOptions} height={250} width={200}/>;
};

export default BellAnimation;


