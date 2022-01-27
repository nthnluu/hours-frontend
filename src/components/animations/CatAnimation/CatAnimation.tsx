import {FC} from "react";
import Lottie from "react-lottie";
import * as animationData from "@util/lottie/89329-loading-2.json";

export interface CatAnimationProps {
}

const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const CatAnimation: FC<CatAnimationProps> = ({}) => {
    return <Lottie isClickToPauseDisabled={true} options={lottieOptions} height={400} width={400}/>;
};

export default CatAnimation;


