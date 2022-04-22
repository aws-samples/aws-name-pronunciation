import architecture_diagram from "../architecture_diagram.png";
import React from "react";
import 'bootstrap/dist/css/bootstrap.css';

const Architecture = () => {
  return (
    <div className="Home">
      <div className="mainApp">

          <h5 className="p-3">The application follows a serverless-architecture.
              <ul className="mt-3" style={{textAlign: "left"}}>
                  <li>A static React app is hosted in an S3 bucket with a CloudFront distribution in front of the website.</li>
                  <li>The backend is running behind API Gateway, implemented as a Lambda to interface with AWS Polly.</li>
                  <li>Here, the application is fully downloaded to the client and rendered in a web browser.</li>
              </ul>
              See below for the implementation solution architecture.
          </h5>

        <img src={architecture_diagram} alt="Architecture diagram"/>

      </div>
    </div>
  );
};

export default Architecture;