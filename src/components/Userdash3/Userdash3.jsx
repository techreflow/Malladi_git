import "./Userdash3.css";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import mqtt from "mqtt";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import moment from 'moment';
import Papa from 'papaparse';

const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
const csvUrl = 'https://malladi.s3.amazonaws.com/AX303.csv';
const csvUrl2='https://malladi.s3.amazonaws.com/AX303.csv';
const proxiedUrl = corsAnywhere + csvUrl;
const proxiedUrl2 = corsAnywhere + csvUrl2;


axios.get(proxiedUrl, { responseType: 'blob' })
    .then((response) => {
        // Handle the response
    })
    .catch((error) => {
        console.error(`Failed to download CSV: ${error}`);
    });

    axios.get(proxiedUrl2, { responseType: 'blob' })
    .then((response) => {
        // Handle the response
    })
    .catch((error) => {
        console.error(`Failed to download CSV: ${error}`);
    });

const Userdash3 = () => {
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const downloadCSV = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Failed to download CSV: ${error}`);
        throw error;
    }
};


const filterCSVByDatetime = (csv, startDatetime, endDatetime) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csv, {
            header: true,
            complete: (results) => {
                const filteredData = results.data.filter(row => {
                    const dateTime = moment(row['Date&Time'], 'DD/MM/YY,HH:mm:ss');
                    return dateTime.isBetween(startDatetime, endDatetime, null, '[]');
                });
                resolve(filteredData);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

const handleSecondExport = async () => {
    const startDatetime = moment(startDateTime, 'YYYY-MM-DDTHH:mm');
    const endDatetime = moment(endDateTime, 'YYYY-MM-DDTHH:mm');

    if (!startDatetime.isValid() || !endDatetime.isValid()) {
        console.error("Invalid date format");
        return;
    }

    try {
        const csv = await downloadCSV(csvUrl);
        const filteredData = await filterCSVByDatetime(csv, startDatetime, endDatetime);

        const csvContent = Papa.unparse(filteredData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'AX301_output.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
};
const handleSecondExport2 = async () => {
  const startDatetime = moment(startDateTime, 'YYYY-MM-DDTHH:mm');
  const endDatetime = moment(endDateTime, 'YYYY-MM-DDTHH:mm');

  if (!startDatetime.isValid() || !endDatetime.isValid()) {
      console.error("Invalid date format");
      return;
  }

  try {
      const csv = await downloadCSV(csvUrl2);
      const filteredData = await filterCSVByDatetime(csv, startDatetime, endDatetime);

      const csvContent = Papa.unparse(filteredData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AX303_output.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  } catch (error) {
      console.error(`An error occurred: ${error}`);
  }
};


  

  document.title = "Dashboard | ReFlow";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const [message, setMessage] = useState(null);
  const [allTopics, setAllTopics] = useState({});
  const [allTopics2, setAllTopics2] = useState({});
  const username = import.meta.env.VITE_MQTT_USERNAME;
  const password = import.meta.env.VITE_MQTT_PASSWORD;
  const topic = "AX3/01/#";
  const topic2 = "AX3/04/#";

  
    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user2) => {
        if (!user2) {
          navigate("/");
        }
      });
  
      // Cleanup function to unsubscribe the observer when the component is unmounted
      return () => unsubscribe();
    }, []);

  

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic);
    });

    client.on("message", (receivedTopic, receivedMessage) => {
      const message = receivedMessage.toString();
      setLoading(false);
      setAllTopics((prevAllTopics) => ({
        ...prevAllTopics,
        [receivedTopic]: message,
      }));
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic]);

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic2);
    });

    client.on("message", (receivedTopic, receivedMessage) => {
      const message = receivedMessage.toString();
      setLoading(false);
      setAllTopics2((prevAllTopics2) => ({
        ...prevAllTopics2,
        [receivedTopic]: message,
      }));
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic2]);

  

  return (
    <>
      {loading ? (
        <div className="loader">
          <h1>Loading...!</h1>
        </div>
      ) : (
        <>
          <section className="main">
            <>
              <p style={{ textAlign: "left", width: "100%" }}>
                Hello,  <strong>{Cookies.get("name")}</strong>{" "}
              </p>
              <p style={{ textAlign: "left", width: "100%" }}>
                <strong>Updated At: </strong>
                {allTopics2["AX3/04/MALLADI/UPDATE_TIME"] || "Loading..."}
              </p>

             

              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{allTopics2["AX3/04/MALLADI/CSV/1"] || "No data available"}</td>
                    <td>{allTopics2["AX3/04/MALLADI/1/CALIBRATED_VALUE"] || "No data available"}</td>
                    <td
                      rowSpan={3}
                      style={{
                        background:
                        //</tr>allTopics2["AX3/04/MALLADI/STATUS"] === "Online" ? "green"
                         "green",
                        color: "white",
                        // allTopics2["AX3/04/MALLADI/STATUS"] || 
                      }}

                    >
                      
                      {"ONLINE"}
                    </td>
                    <td
                      rowSpan={3}
                      style={{
                        background: "white",
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <label style={{ fontSize: '12px', margin: '5px 0' }}>
                          Start Date and Time:
                          <input
                            type="datetime-local"
                            id="startDateTime"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                            style={{
                              fontSize: '12px',
                              padding: '5px',
                              marginLeft: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                        </label>
                        <label style={{ fontSize: '12px', margin: '5px 0' }}>
                          End Date and Time:
                          <input
                            type="datetime-local"
                            id="endDateTime"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            style={{
                              fontSize: '12px',
                              padding: '5px',
                              marginLeft: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                        </label>
                        <button
                          className="btn-export"
                          onClick={handleSecondExport2}
                          style={{
                            fontSize: '14px',
                            padding: '8px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            marginTop: '10px'
                          }}
                        >
                          EXPORT
                        </button>
                        <p style={{ fontSize: "12px", marginTop: "8px" }}>SNo: AX303</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>{allTopics2["AX3/04/MALLADI/CSV/2"] || "No data available"}</td>
                    <td>{allTopics2["AX3/04/MALLADI/2/CALIBRATED_VALUE"] || "No data available"}</td>
                  </tr>

                  <tr>
                    <td>{allTopics2["AX3/04/MALLADI/CSV/3"] || "No data available"}</td>
                    <td>{allTopics2["AX3/04/MALLADI/3/CALIBRATED_VALUE"] || "No data available"}</td>
                  </tr>
                </tbody>
              </table>
            </>
          </section>
        </>
      )}
    </>
  );
};

export default Userdash3;
