import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils,faNewspaper,faDumbbell,faGaugeHigh} from "@fortawesome/free-solid-svg-icons";  

function Modules() {
  return (
    <div className='Module-box'>

      <Link to="/bmi" className="modbox">
        <p className="box-title">BMI
        <FontAwesomeIcon icon={faGaugeHigh} style={{ marginLeft: "185px" }} />
        </p>
        <p className="box-desc">Analyze your body mass index to track your health progress.</p>
      </Link>

      <Link to="/workout" className="modbox">
        <p className="box-title">Workout Planner
        <FontAwesomeIcon icon={faDumbbell} style={{ marginLeft: "64px" }} />
        </p>
        <p className="box-desc">Customize your daily routine and log your sets and reps.</p>
      </Link>

      <Link to="/diet" className="modbox">
        <p className="box-title">Diet Planner 
        <FontAwesomeIcon icon={faUtensils} style={{ marginLeft: "95px" }} />
        </p>
        <p className="box-desc">Log your meals and monitor your daily caloric intake.</p>
      </Link>

      <Link to="/report" className="modbox">
        <p className="box-title">Fitness Report
        <FontAwesomeIcon icon={faNewspaper} style={{ marginLeft: "95px" }} />

        </p>
        <p className="box-desc">Get your overall Fitness report.</p>
      </Link>

    </div>
  );
}

export default Modules;