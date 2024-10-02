import "./Admindash1.css";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
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




const Admindash1 = () => {
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
          link.setAttribute('download', 'AX303.csv');
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
        link.setAttribute('download', 'AX303.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
};



    
  
  
  

     

  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
    const [value, setValue] = useState();
    const [value2, setValue2] = useState();
    const [value3, setValue3] = useState();
    
    const [Min1, setMin1] = useState();
    const [Max1, setMax1] = useState();

    const [Min2, setMin2] = useState();
    const [Max2, setMax2] = useState();

    const [Min3, setMin3] = useState();
    const [Max3, setMax3] = useState();

    const [cal1, setCal1] = useState();
    const [cal2, setCal2] = useState();
    const [cal3, setCal3] = useState();

    const [fac1, setFac1] = useState();
    const [fac2, setFac2] = useState();
    const [fac3, setFac3] = useState();


    const [value11, setValue11] = useState();
    const [value12, setValue12] = useState();
    const [value13, setValue13] = useState();
    
    const [Min11, setMin11] = useState();
    const [Max11, setMax11] = useState();

    const [Min12, setMin12] = useState();
    const [Max12, setMax12] = useState();

    const [Min13, setMin13] = useState();
    const [Max13, setMax13] = useState();

    const [cal11, setCal11] = useState();
    const [cal12, setCal12] = useState();
    const [cal13, setCal13] = useState();

    const [fac11, setFac11] = useState();
    const [fac12, setFac12] = useState();
    const [fac13, setFac13] = useState();

    const [time, setTime] = useState();
    
    
  
  document.title = "Dashboard | ReFlow";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const [message, setMessage] = useState(null);
  const [allTopics, setAllTopics] = useState({});
  const [allTopics2, setAllTopics2] = useState({});
  const username = import.meta.env.VITE_MQTT_USERNAME;
  const password = import.meta.env.VITE_MQTT_PASSWORD;
  const topic = "AX3/04/MALLADI/#";
  const topic2 = "AX3/02/MALLADI/#";
  

  const temp = allTopics["AX3/04/MALLADI/1/VALUE"];

  

  
 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
        } catch (error) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    });

    // Cleanup function to unsubscribe the observer when the component is unmounted
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };
  
    const client = mqtt.connect(brokerUrl, options);
  
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("AX3/04/MALLADI/CSV/1", (error) => {
        if (error) {
          console.error("Error subscribing to topic:", error);
        } else {
          console.log("Subscribed to topic 'AX3/04/MALLADI/CSV/1'");
        }
      });
    });
    client.subscribe("AX3/04/MALLADI/CSV/2");
    client.subscribe("AX3/04/MALLADI/CSV/3");


    client.subscribe("AX3/04/MALLADI/1/CONFIG/MIN");
    client.subscribe("AX3/04/MALLADI/1/CONFIG/MAX");

    client.subscribe("AX3/04/MALLADI/2/CONFIG/MIN");
    client.subscribe("AX3/04/MALLADI/2/CONFIG/MAX");

    client.subscribe("AX3/04/MALLADI/3/CONFIG/MIN");
    client.subscribe("AX3/04/MALLADI/3/CONFIG/MAX");

    client.subscribe("AX3/04/MALLADI/1/CONFIG/CALIBRATION");
    client.subscribe("AX3/04/MALLADI/2/CONFIG/CALIBRATION");
    client.subscribe("AX3/04/MALLADI/3/CONFIG/CALIBRATION");

    client.subscribe("AX3/04/MALLADI/1/CONFIG/FACTOR");
    client.subscribe("AX3/04/MALLADI/2/CONFIG/FACTOR");
    client.subscribe("AX3/04/MALLADI/3/CONFIG/FACTOR");
    client.subscribe("AX3/04/MALLADI/3/CONFIG/UPDATE_TIME");


    //2


  
    client.on("message", (topic, message) => {
      
      if (topic === "AX3/04/MALLADI/CSV/1") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/CSV/2") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/CSV/3") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue3(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/1/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/1/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/2/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/2/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/3/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin3(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/3/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax3(data); // Update the value state with the received message
        console.log(data);
      }

      if (topic === "AX3/04/MALLADI/1/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/2/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/3/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal3(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/1/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/2/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/04/MALLADI/3/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac3(data); // Update the value state with the received message
        console.log(data);
      }
     
    });
  
    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, []);

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
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

    // Initialize an object to store all topics and messages
    const allaTopics = {};
    


    client.on("message", (receivedTopic, receivedMessage) => {
      try {
        // Try to parse the incoming message as JSON
        const parsedMessage = JSON.parse(receivedMessage.toString());

        // Update the object with the latest message for the specific topic
        allaTopics[receivedTopic] = parsedMessage;
        

        setLoading(false);
        setAllTopics((prevAllTopics) => ({
          ...prevAllTopics,
          [receivedTopic]: parsedMessage,
        }));
      } catch (error) {}
    });
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("AX3/04/MALLADI/UPDATE_TIME", (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log("Subscribed to topic 'AX3/04/MALLADI/UPDATE_TIME'");
        }
      });
    });

    client.on("message", (topic, message) => {
      if (topic === "AX3/04/MALLADI/UPDATE_TIME") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setTime(data); // Update the value state with the received message
        console.log(data);
      }
    });
  
    
   

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic]);


  


  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };
    
  
  

    const client = mqtt.connect(brokerUrl, options);
    
    console.log("omayoma");
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    
      client.publish("AX3/04/MALLADI/CSV/1",value,{ retain: true });
      client.publish("AX3/04/MALLADI/CSV/2",value2,{ retain: true });
      client.publish("AX3/04/MALLADI/CSV/3",value3,{ retain: true });

      client.publish("AX3/04/MALLADI/1/CONFIG/MIN",Min1,{ retain: true });
      client.publish("AX3/04/MALLADI/1/CONFIG/MAX",Max1,{ retain: true });

      client.publish("AX3/04/MALLADI/2/CONFIG/MIN",Min2,{ retain: true });
      client.publish("AX3/04/MALLADI/2/CONFIG/MAX",Max2,{ retain: true });
      
      client.publish("AX3/04/MALLADI/3/CONFIG/MIN",Min3,{ retain: true });
      client.publish("AX3/04/MALLADI/3/CONFIG/MAX",Max3,{ retain: true });

      client.publish("AX3/04/MALLADI/1/CONFIG/CALIBRATION",cal1,{ retain: true });
      client.publish("AX3/04/MALLADI/2/CONFIG/CALIBRATION",cal2,{ retain: true });
      client.publish("AX3/04/MALLADI/3/CONFIG/CALIBRATION",cal3,{ retain: true });

      client.publish("AX3/04/MALLADI/1/CONFIG/FACTOR",fac1,{ retain: true });
      client.publish("AX3/04/MALLADI/2/CONFIG/FACTOR",fac2,{ retain: true });
      client.publish("AX3/04/MALLADI/3/CONFIG/FACTOR",fac3,{ retain: true });
      
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [value, value2, value3, Min1,Max1,Min2,Max2,Min3,Max3,cal1,cal2,cal3,fac1,fac2,fac3]);






  


  






  

  
  
  

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
              <div className="dashintro">
                <p style={{ textAlign: "left", width: "100%" }}>
                  Hello ADMIN ,{" "}
                  <strong>{Cookies.get("name")}</strong>{" "}
                </p>
                <Link to="/register">Add User</Link>
              </div>
              <div className="dashintro">
    <p style={{ textAlign: "left", width: "100%" }}>
        <strong>Updated At : </strong> 
        {time || "Loading..."}
    </p>
</div>


              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th colSpan={2} >Range</th>
                    <th rowSpan={2} >Calibration</th>
                    <th rowSpan={2}>Factor
                    <p style={{ fontSize: 10, color: 'white', margin: 5 }}>Enter (0= Addition ,1= Subtraction , 2= Multiplication, 3= Division)</p>
</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Calibrated Readings</th>
                    <th rowSpan={2}>Temperature Level</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                  <tr >
                    <th >Min</th>
                    <th >Max</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                  <td><input type="text" value={value || "LOADING.."} onChange={(e) => setValue(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min1|| "LOADING.."} onChange={(e) => setMin1(e.target.value)} /></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max1 || "LOADING.."}onChange={(e) => setMax1(e.target.value)} /></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal1).toFixed(2) || "" }onChange={(e) => setCal1(e.target.value)} /></td>
                  
                  <td>
  <select
    style={{
      fontSize: "24px",
      height: "40px",
      width: "100px"
    }}
    value={fac1 || ""}
    onChange={(e) => setFac1(e.target.value)}
  >
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
  </select>
</td>
                    <td>
                        
                      {parseFloat(allTopics["AX3/04/MALLADI/1/VALUE"]).toPrecision(
                        4
                      ) || "LOADING...."} 

                    </td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/04/MALLADI/1/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."} 
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/04/MALLADI/1/CALIBRATED_VALUE"]) || 0}
                        min={allTopics["AX3/04/MALLADI/1/CONFIG/MIN"]}
                        max={allTopics["AX3/04/MALLADI/1/CONFIG/MAX"]}
                      ></meter>
                    </td>

                    <td
                      rowSpan={3}
                      
                      style={{
                        background:
                          
                         "Online" ? "green" : "rgb(245,106,94)",
                        color: "white",
                      }}
                    >
                      {allTopics["AX3/04/MALLADI/STATUS"] || "ONLINE"}
                    </td>
                    <td
                      rowSpan={3}
                      style={{
                        background: "white",
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                onClick={handleSecondExport}
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
            <p style={{ fontSize: "12px", marginTop: "8px", fontWeight: "bold"}}>SNo: AX303</p>
        </div>
                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={value2 || "LOADING.."} onChange={(e) => setValue2(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min2|| "LOADING.."} onChange={(e) => setMin2(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max2|| "LOADING.."} onChange={(e) => setMax2(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal2).toFixed(2) || "" } onChange={(e) => setCal2(e.target.value)} /></td>
                  <td>
  <select
    style={{
      fontSize: "24px",
      height: "40px",
      width: "100px"
    }}
    value={fac2 || ""}
    onChange={(e) => setFac2(e.target.value)}
  >
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
  </select>
</td>
                    <td>
                      {parseFloat(allTopics["AX3/04/MALLADI/2/VALUE"]).toPrecision(
                        4
                      ) || "LOADING...."}  


                    </td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/04/MALLADI/2/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  

                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/04/MALLADI/2/VALUE"]) || 0}
                        min={allTopics["AX3/04/MALLADI/2/CONFIG/MIN"]}
                        max={allTopics["AX3/04/MALLADI/2/CONFIG/MAX"]}
                      ></meter>
                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={value3 || "LOADING.."} onChange={(e) => setValue3(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min3|| "LOADING.."} onChange={(e) => setMin3(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max3|| "LOADING.."} onChange={(e) => setMax3(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal3).toFixed(2) || "LOADING...." } onChange={(e) => setCal3(e.target.value)}/></td>
                  <td>
  <select
    style={{
      fontSize: "24px",
      height: "40px",
      width: "100px"
    }}
    value={fac3 || ""}
    onChange={(e) => setFac3(e.target.value)}
  >
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
  </select>
</td>
                    <td>
                      {parseFloat(allTopics["AX3/04/MALLADI/3/VALUE"]).toPrecision(
                        4
                      )  || "LOADING...."} 


                    </td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/04/MALLADI/3/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  


                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/04/MALLADI/3/VALUE"]) || 0}
                        min={allTopics["AX3/04/MALLADI/3/CONFIG/MIN"]}
                        max={allTopics["AX3/04/MALLADI/3/CONFIG/MAX"]}
                      ></meter>
                    </td>
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

export default Admindash1;
