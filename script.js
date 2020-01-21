class BreakControl extends React.Component{
    render(){
        let {incrBrLength, decrBrLength,breakLength} = this.props
        return(
            <div id='break-label'className='control'>
                Break Length:
                <div className='time'>
                <button  onClick={decrBrLength}id='break-decrement'>
                    -
                </button>
                <span id='break-length'>{breakLength}</span>
                <button  onClick={incrBrLength}id='break-increment'>
                    +
                </button>
                </div>
            </div>
        )
    }
}
class SessionControl extends React.Component{
    render(){
        let {incrSesLength, decrSesLength,sessionLength} = this.props
        return(
            <div id='session-label' className='control'>
                Session Length:
                <div className='time'>
                <button  onClick={decrSesLength}id='session-decrement'>
                    -
                </button>
                <span id='session-length'>{sessionLength}</span>
                <button  onClick={incrSesLength}id='session-increment'>
                    +
                </button>
                </div>
            </div>
        )
    }
} 
const Timer =({timeLeft,startPause, reset,session})=>{
    let minutes = Math.floor(timeLeft/60)
    let seconds = timeLeft-minutes*60
    return(
        <div id='timer-label'>
                {session?'Session':'Break'}:
    <div id='time-left'>{minutes<10?'0'+minutes:minutes}:{seconds<10?'0'+seconds:seconds}</div>
    <div className="timer-control-buttons">
            <button onClick={startPause} id='start_stop'>start/pause</button>
            <button onClick={reset} id='reset'>reset</button>
        </div>
        </div>
    )
}
class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            breakLength:5,
            sessionLength:25,
            timerOn:false,
            timeLeft:1500,
            session:true,
        }
        this.incrBrLength = this.incrBrLength.bind(this)
        this.decrBrLength = this.decrBrLength.bind(this)
        this.incrSesLength = this.incrSesLength.bind(this)
        this.decrSesLength = this.decrSesLength.bind(this)
        this.reset=this.reset.bind(this)
        this.startPause = this.startPause.bind(this)
    }
    reset(){
        this.setState({timeLeft:1500, timerOn:false, session:true, breakLength:5, sessionLength:25})
        let sound = document.getElementById('beep')
        sound.pause()
        sound.currentTime=0
    }
    async decrementTimer(){
        if(this.state.timerOn & this.state.timeLeft>0){
            this.setState(state=>{return{timeLeft:state.timeLeft-=1}})
        }
        if(this.state.timeLeft===0){
            let sound = document.getElementById('beep')
            sound.play()
            await this.setState(state=>{return {session:!state.session}})
            if(this.state.session){
                this.setState({timeLeft:this.state.sessionLength*60})
            }
            else{
                this.setState({timeLeft:this.state.breakLength*60})
            }
        }
    }
    startPause(){
        this.setState(state=>{return{timerOn:!state.timerOn}})
        
    }
    incrBrLength(){
        if(this.state.breakLength<=59){
            this.setState(state=>{return {breakLength:state.breakLength+=1}})
        }
    }
    decrBrLength(){
        if(this.state.breakLength>1){
            this.setState(state=>{return {breakLength:state.breakLength-=1}})
        }
    }
    incrSesLength(){
        if(this.state.sessionLength<=59){
            this.setState(state=>{return {sessionLength:state.sessionLength+=1}})
            if(this.state.session){
                this.setState(state=>{return {timeLeft:state.sessionLength*60}})
            }
        }
    }
    decrSesLength(){
        if(this.state.sessionLength>1){
            this.setState(state=>{return {sessionLength:state.sessionLength-=1}})
            if(this.state.session){
                this.setState(state=>{return {timeLeft:state.sessionLength*60}})
            }
        }
    }
    componentDidMount(){
        var timerInterval = setInterval(()=>{
            this.decrementTimer()
        },1000)
    }
    render(){
        return(
            <div className='App'>
                <div className="timer">
                <div className="control-panel">
                <BreakControl incrBrLength={this.incrBrLength} decrBrLength={this.decrBrLength} breakLength={this.state.breakLength}/>
                <SessionControl incrSesLength={this.incrSesLength} decrSesLength={this.decrSesLength} sessionLength={this.state.sessionLength}/>
                </div>
                <Timer session={this.state.session}timeLeft={this.state.timeLeft} startPause={this.startPause} reset={this.reset}/>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<App/>, document.getElementById('root'))