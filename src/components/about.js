/**
 * About module.
 * @module
 */

// React
import React from 'react'
import { connect } from 'react-redux';
import { ButtonToolbar, Button } from 'react-bootstrap'
import Icon from './font-awesome'
import marked from 'marked';
import { version } from '../reducers/settings'
import { confirm } from './laserweb'
import { fetchRelease } from '../lib/releases';
import { LOCALSTORAGE_KEY, getDebug, setDebug } from '../index'
import Toggle from 'react-toggle'

/**
 * About component.
 *
 * @extends module:react~React~Component
 * @param {Object} props Component properties.
 */

 class About extends React.Component {
    /**
     * Render the component.
     * @return {String}
     */
    render() {

        let machineLogo;
        let machineAbout;
        if (this.props.settings.__selectedProfile && this.props.profiles.hasOwnProperty(this.props.settings.__selectedProfile)){
          let logoFile=this.props.profiles[this.props.settings.__selectedProfile].machineLogo
          let aboutFile=this.props.profiles[this.props.settings.__selectedProfile].machineAbout
          if (logoFile) {
            machineLogo=<img style={{ width: 66 + '%', borderRadius: 14, }} src={require('../data/lw.machines/machines/'+logoFile)} alt="Logo"/>
          } else {
            machineLogo=<img style={{ width: 66 + '%', borderRadius: 14, }} src={require('../lw-logo.png')} alt="Logo"/>
          }
          if (aboutFile) {
            machineAbout=<div dangerouslySetInnerHTML={{__html: require('string-loader!../data/lw.machines/machines/'+aboutFile) + '<hr/>'}}></div>
          }
        } else {
          machineLogo=<img style={{ width: 66 + '%', borderRadius: 14, }} src={require('../lw-logo.png')} alt="Logo"/>
        }


        return (
            <div>

            {machineLogo}
            {machineAbout}

                <h3>LaserWeb Versions</h3>
                  <dl>
                    <dt><Icon name="cubes"/> Frontend: {version}</dt><dd></dd><p/>
                    <dt><Icon name="usb"/> Backend: {this.props.settings.comServerVersion} (API: {this.props.settings.comApiVersion}) </dt><dd></dd><p/>
                  </dl>
                  <Releases/>
                <h3>Support Communities</h3>
                  <dl>
                    <dt><Icon name="users"/> <a href="https://github.com/LaserWeb">LaserWeb Github Organisation</a></dt>
                    <dd><small>- developer community</small></dd><p/>
                    <dt><Icon name="users"/> <a href="https://forum.makerforums.info/c/laserweb-cncweb/">LaserWeb Community on MakerForums</a></dt>
                    <dd><small>- support Community for this software itself</small></dd><p/>
                    <dt><Icon name="users"/> <a href="https://forum.makerforums.info/c/k40/">K40 Laser MakerForum Community</a></dt>
                    <dd><small>- support community for popular K40 CO2 Lasers</small></dd><p/>
                    <dt><Icon name="users"/> <a href="https://forum.makerforums.info/">All MakerForums Communities</a></dt>
                    <dd><small>- support communities for Makers</small></dd><p/>
                  </dl>
                <h3>Developers</h3>
                  <dl>
                    <dt><Icon name="user"/> <a href="https://plus.google.com/101442607030198502072">Todd Fleming</a> <a target="_blank" href="https://paypal.me/tbfleming"><Icon name="paypal"/></a></dt>
                    <dd><small>- G-Code Generation, 3D viewer, Simulator</small></dd><p/>
                    <dt><Icon name="user"/> <a href="https://plus.google.com/+S%C3%A9bastienMischler-Skarab">Sebastien Mischler</a> <a target="_blank" href="https://paypal.me/skarab"><Icon name="paypal"/></a></dt>
                    <dd><small>- Backend + Dev environment</small></dd><p/>
                    <dt><Icon name="user"/> <a href="https://plus.google.com/113562432484049167641">Jorge Robles</a> <a target="_blank" href="https://paypal.me/JorgeDredd"><Icon name="paypal"/></a></dt>
                    <dd><small>- Settings modules, UI tweaks, Workspace Export</small></dd><p/>
                    <dt><Icon name="user"/> <a href="https://plus.google.com/+ClaudioPrezzi">Claudio Prezzi</a> <a target="_blank" href="https://paypal.me/cprezzi"><Icon name="paypal"/></a></dt>
                    <dd><small>- Communications</small></dd><p/>
                    <dt><Icon name="user"/> <a href="https://plus.google.com/+PetervanderWalt">Peter van der Walt</a> <a target="_blank" href="https://paypal.me/openhardwarecoza"><Icon name="paypal"/></a></dt>
                    <dd><small>- Support + User Interface</small></dd><p/>
                    <dt><Icon name="user"/> <a href="https://plus.google.com/+ArielYahni">Ariel Yahni</a></dt>
                    <dd><small>- Beta testing</small></dd><p/>
                  </dl>
                <div><i>LaserWeb and CNCWeb is <kbd>free software</kbd>. The team of developers have spent countless hours coding, testing and supporting this application. If you enjoy using this application, consider donating a coffee or a beer towards the developers to show your appreciation, by clicking the <Icon name="paypal"/> icon next to the developers you want to support</i></div>

                <hr/>
                <div className="well">
                  <h5>Application reset and debug</h5>
                  <Lifesaver/>
                </div>

            </div>
        )
    }
}

About = connect(
    state => ({ settings: state.settings, profiles: state.machineProfiles })
)(About);

// Exports
export default About


class Lifesaver extends React.Component
{
    render()
    {
        let button;
        if (window.require) button = <Button bsSize="xs" bsStyle="warning" onClick={(e) => { this.props.handleDevTools(e) }}><Icon name="gear" /> Toggle Dev tools</Button>

        return <ButtonToolbar>
          {button}
           <div className="form-group toggle-right"><Toggle defaultChecked={getDebug()} onChange={this.props.handleDebug} /><label>Enable debug logger</label></div>
          <Button bsSize="xs" bsStyle="warning" onClick={(e) => { this.props.handleRefresh(e) }}><Icon name="refresh" /> Refresh window</Button>
          <Button bsSize="xs" bsStyle="danger" onClick={(e) => { this.props.handleReset(e) }}><Icon name="bolt" /> Reset to factory defaults</Button>
        </ButtonToolbar>
    }
}

Lifesaver = connect((store)=>({}),(dispatch) =>{
    return {
        handleDebug:(e)=>{
            setDebug(e.target.checked)
        },
        handleDevTools: () => {
            if (window.require) { // Are we in Electron?
                const electron = window.require('electron');
                const app = electron.remote;
                var focusedWindow = app.BrowserWindow.getFocusedWindow()
                // focusedWindow.openDevTools();
                if (app.BrowserWindow.getFocusedWindow) {
                    // var focusedWindow = app.BrowserWindow.getFocusedWindow()
                    if (focusedWindow.isDevToolsOpened()) {
                        focusedWindow.closeDevTools();
                    } else {
                        focusedWindow.openDevTools();
                    }
                }
            } else {
                console.warn("Can't do that, pal")
            }
        },
        handleReset: () => {
            confirm("All data will be zapped!", (b) => {
              if (b) {
                window.localStorage.removeItem(LOCALSTORAGE_KEY)
                location.reload();
              }
            })
        },
        handleRefresh: () => {
            confirm("Are you sure? This will destroy unsaved work", (b) => { if (b) location.reload(); })
        }
    }
  }
)(Lifesaver)



export class Releases extends React.Component {

    constructor(props)
    {
        super(props);
        this.state={}
    }

    componentDidMount() {
        fetchRelease().then((release)=>{
            this.setState(release);
        })
    }

    render() {
        return <div className="releases">
            {this.state.tag_name ? <h4>Latest release: <a href={this.state.html_url} target="__blank">{this.state.tag_name}</a></h4>:undefined }
            {this.state.body ? <div dangerouslySetInnerHTML={{__html: marked(this.state.body)}}/>:undefined }
        </div>
    }

}
