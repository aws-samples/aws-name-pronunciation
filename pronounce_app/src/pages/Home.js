import '../css/home.css';
import React from 'react';
import config from "../config.json";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import { Dropdown, DropdownButton } from "react-bootstrap";

import polly_logo from "../polly_logo.png";


class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_name: '',
      selected_lang: '',
      selected_voice: '',
      sorted_voices: null,
      isLoaded: false,
      link_share: null
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleVoiceChange = this.handleVoiceChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if (window.location.pathname === "/share") {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        this.state.user_name = params.get("user_name");
        this.state.selected_lang = params.get("selected_lang");
        this.state.selected_voice = params.get("selected_voice");
    }
  }

  componentDidMount() {
    const url = config.ApiStack.getVoicesApiUrl;
    axios.get(url)
      .then((response) => {
        const result = response.data["sorted_voices"];
        if (window.location.pathname === "/share") {
          this.setState({
            isLoaded: true,
            sorted_voices: result
          });
        }
        else {
          this.setState({
            isLoaded: true,
            sorted_voices: result,
            selected_lang: "US English",
            selected_voice: "Joanna"
          });
        }
      }
    )
  }

  handleNameChange(event) {
    this.setState({
      user_name: event.target.value,
    });
  }

  handleLanguageChange(event) {
    this.setState({
      selected_lang: event,
      selected_voice: Object.keys(this.state.sorted_voices[event]["Voices"])[0]
    });
  }

  handleVoiceChange(event) {
    this.setState({
      selected_voice: event
    });
  }

  handleSubmit(event) {
    const button_name = event.nativeEvent.submitter.name;
    const { user_name, selected_lang, selected_voice, sorted_voices} = this.state;

    if (button_name === "reset") {
      this.setState({
        user_name: "",
        selected_lang: "US English",
        selected_voice: "Joanna"
      })
      window.history.pushState({}, document.title, "/");
    }

    else if (user_name !== '' && button_name === "share") {
      const link_share = encodeURI(window.location.origin + "/share?user_name=" + user_name +
      "&selected_lang=" + selected_lang + "&selected_voice=" + selected_voice);
      this.setState({
        link_share: link_share
      });
    }

    else if (user_name !== '' && (button_name === "stream" || button_name === "download")) {
      axios({
        method: "post",
        url: encodeURI(config.ApiStack.synthesizeSpeechApiUrl +
            "?user_name=" + user_name +
            "&language_name=" + selected_lang +
            "&voice_name=" + selected_voice),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          sorted_voices_obj: JSON.stringify(sorted_voices)
        }
      }).then(response=>{
        const mp3_base64_stream = response.data.mp3_base64_str;

        if (button_name === "stream") {
          const audioPlayer = document.getElementById("streamMP3");
          audioPlayer.src = mp3_base64_stream;
          audioPlayer.play();
        }

        else if (button_name === "download") {
          const mp3_base64_str = mp3_base64_stream.replace("data:audio/mp3;base64,", "");
          const binaryString = window.atob(mp3_base64_str);
          const binaryLen = binaryString.length;
          let mp3_bytes = new Uint8Array(binaryLen);
          for (let i = 0; i < binaryLen; i++) {
             mp3_bytes[i] = binaryString.charCodeAt(i);
          }
          const fileName = `${user_name}_${selected_lang}_${selected_voice}.mp3`;
          const blob = new Blob([mp3_bytes], {type: "audio/mpeg"});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
      })
    }

    else {
      alert('Enter a name first')
    }

    event.preventDefault();
  }

  render() {
    const {user_name, selected_lang, selected_voice, sorted_voices, isLoaded, link_share } = this.state;

    if (isLoaded) {
      return (
          <div className="Home">

            <div className="mainApp">
              <h2>Save your name's pronunciation and teach colleagues how to say your name</h2>


              <div id="name-form" className="nameInput">
                <form name="user_name" onSubmit={this.handleSubmit}>

                  <div className="nameInput-top">
                    <div className="nameInput-col1">
                      <p>Powered by</p>
                      <img src={polly_logo} alt="Polly logo"/>
                    </div>

                    <div className="nameInput-col2">

                      <div className="col2-input">

                        <label>
                          Name
                        </label>

                        <input name="user_name" class="form-control" type="text" value={user_name}
                               onChange={this.handleNameChange}/>

                      </div>

                      <div className="col2-input">

                        <label>
                          Language
                        </label>

                        <DropdownButton
                          title={selected_lang}
                          onSelect={this.handleLanguageChange}>
                          {Object.keys(sorted_voices).map((lang_name) => (
                            <Dropdown.Item eventKey={lang_name}>{lang_name}</Dropdown.Item>
                          ))}
                          </DropdownButton>
                      </div>

                      <div className="col2-input">
                        <label>
                          Voice
                        </label>

                        <DropdownButton
                          title={selected_voice}
                          onSelect={this.handleVoiceChange}>
                          {Object.keys(sorted_voices[selected_lang]["Voices"]).map((voice_name) => (
                              <Dropdown.Item eventKey={voice_name}>{voice_name}</Dropdown.Item>
                          ))}
                          </DropdownButton>
                      </div>

                      <div className="col2-input">
                        <div id="buttons" className="playButton">
                          <button type="submit" className="btn btn-primary btn-lg" name="stream">
                            <svg width="20" height="20" fill="currentColor">
                              <path
                                  d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                            </svg>
                            Play
                          </button>

                          <audio id="streamMP3" src=""/>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="nameInput-bottom">

                    <div className="nameInput-bottom-row">
                      <div className="nameInput-bottom-column">
                        <button type="submit" name="reset" className="btn btn-primary">Reset form fields</button>
                      </div>
                      <div className="nameInput-bottom-column">
                        <button type="submit" name="download" className="btn btn-primary">Download mp3 file</button>
                      </div>
                      <div className="nameInput-bottom-column">
                        <button type="submit" name="share" className="btn btn-primary">Generate shareable link</button>
                      </div>
                      <div className="nameInput-bottom-column">
                        <a href={link_share}>Shareable Link</a>
                      </div>
                    </div>

                  </div>

                </form>
              </div>
            </div>

          </div>
      );
    }
    else if (!isLoaded) {
      return (
          <div className="Home">
            <div className="mainApp">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"/>
              </div>
            </div>
          </div>
      );
    }
  }
}


export default Home;
