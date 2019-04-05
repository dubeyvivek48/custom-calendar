import React from 'react';
import moment from 'moment';
import './calendar.css';

export default class Calendar extends React.Component {
   

    constructor(props) {
        super(props);
        this.state={
            dateContext: moment(),
            today: moment(),
            showMonthPopup: false,
            showYearPopup: false,
            selectedDay: null,
            msgPopup:false,
            eventMsg:'',
            error:false,
            errorMsg:'plese Enter Event',
            calendarMonth:'',
            calendarYear:'',
            events:[]
        }
    }


    weekdays = moment.weekdays(); //["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]
    weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    months = moment.months();
    componentWillMount(){
        this.setState({
            calendarMonth:this.state.dateContext.format("MMMM"),
            calendarYear:this.state.dateContext.format("Y"),
        })
    }
    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        //console.log("currentDate: ", this.state.dateContext.get("date"));
        return this.state.dateContext.get("date");
    }
    currentDay = () => {
        return this.state.dateContext.format("D");       
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
        return firstDay;
    }

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext,
            calendarMonth:moment(dateContext).add(0, "month").format("MMMM"),
            calendarYear:moment(dateContext).add(0, "year").format("Y"),
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext,
            calendarMonth:moment(dateContext).subtract(0, "month").format("MMMM"),
            calendarYear:moment(dateContext).subtract(0, "year").format("Y"),
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    onSelectChange = (e, data) => {
        this.setMonth(data);
        this.props.onMonthChange && this.props.onMonthChange();

    }
    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <a href="#" onClick={(e)=> {this.onSelectChange(e, data)}}>
                        {data}
                    </a>
                </div>
            );
        });

        return (
            <div className="month-popup">
                {popup}
            </div>
        );
    }

    onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () => {
        return (
            <span className="label-month"
                onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup &&
                 <this.SelectList data={this.months} />
                }
            </span>
        );
    }

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        });
    }

    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        })
    }
    onYearChange = (e) => {
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }

    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            })
        }
    }

    YearNav = () => {
        return (
            this.state.showYearNav ?
            <input
                defaultValue = {this.year()}
                className="editor-year"
                ref={(yearInput) => { this.yearInput = yearInput}}
                onKeyUp= {(e) => this.onKeyUpYear(e)}
                onChange = {(e) => this.onYearChange(e)}
                type="number"
                placeholder="year"/>
            :
            <span
                className="label-year"
                onDoubleClick={(e)=> { this.showYearEditor()}}>
                {this.year()}
            </span>
        );
    }

    onDayClick = (e, day) => {
        let check =this.state.events.filter(e=>e.selectedDay===this.state.selectedDay&&e.calendarMonth===this.state.calendarMonth&&e.calendarYear===this.state.calendarYear) 
        this.setState({
            selectedDay: day,
           // eventMsg:check[0]===undefined?'':check[0].msg,
            msgPopup:true,
        }, () => {
            //console.log("SELECTED DAY: ", this.state.selectedDay);
            //console.log(this.state)
        });

        this.props.onDayClick && this.props.onDayClick(e, day);
    }
     OnChaneEvent=(e)=>{
        this.setState({
            eventMsg:e.target.value
        })
    }
    onEventUpdate=(data)=>{
        console.log(data);
    }
    closeDilog=()=>{
        this.setState({
            msgPopup:false, 
            eventMsg:'',
            error:false
        })
    }


handleClose=(data)=>{
    console.log(data);
    this.setState({events: this.state.events.filter((data1)=>{data1.id!==data.id})} )
}
    onSubmit=(e)=>{
        let eventday=[...this.state.events];
        e.preventDefault() 
        if(this.state.eventMsg.length){
            eventday.push( {
                calendarMonth:this.state.calendarMonth,
                calendarYear:this.state.calendarYear,
                selectedDay:this.state.selectedDay,
                msg:this.state.eventMsg,
                id:this.state.selectedDay+this.state.calendarMonth+this.state.calendarYear+this.state.eventMsg,
            }) 
            this.setState({
                msgPopup:false,                        
                events:eventday,
                eventMsg:'',
                error:false
            })
        }
        else{
            this.setState({
                error:true
            })
        }
        //console.log(this.state);
        
    }
  
    render() {
        console.log(this.state)
        // Map the weekdays i.e Sun, Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <div key={day} className="week-day">{day}</div>
            )
        });

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<div key={i * 80} className="emptySlot">     {""}    </div>);
        }

        //console.log("blanks: ", blanks);

        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d == this.currentDay() ? "day current-day": "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            daysInMonth.push(
                <div key={d} className={className + selectedClass } >
                    <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
                    
                    {this.state.events.map((data)=>{
                       return data.selectedDay===d&&data.calendarMonth===this.state.calendarMonth&&this.state.calendarYear===data.calendarYear?<span><span className="event" contentEditable={true} onChange={()=>this.onEventUpdate(data.id)}> {data.msg}</span><span className="close"  onClick={()=>{this.handleClose(data.id);}}> &times;</span></span>:''
                    })}
                    
                </div>
            );
            
        }


        //console.log("days: ", daysInMonth);

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });
            //console.log(rows)
        let trElems = rows.map((d, i) => {
            return (
                <div key={i*100} className="date-row">
                    {d}
                </div>
            );
        })

        return (
            <div className="calendar-container">
                <div className="calendar">
                        <div  className="calendar-header">
                            <div  className="nav-month">
                                <i className="prev fa fa-fw fa-chevron-left"
                                    onClick={(e)=> {this.prevMonth()}}>
                                </i>
                            </div>
                            <div >
                                <this.MonthNav />
                                {" "}
                                <this.YearNav />
                            </div>
                            
                            <div className="nav-month">
                                <i className="prev fa fa-fw fa-chevron-right"
                                    onClick={(e)=> {this.nextMonth()}}>
                                </i>
                            </div>
                        </div>
                    
                    <div className="row">
                        <div className="day">
                            {weekdays}
                        </div>
                        {trElems}
                    </div>
                </div>
                {
                    this.state.msgPopup?                
                <div className="popupForm">
                <div className="modal fade show"  role="dialog" >
                    <div className="modal-dialog" role="document">
                    <button type="button" className="close"  onClick={this.closeDilog}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                        <div className="modal-content">
                        <div className="modal-body">                             
                        <form>
                            <div className="form-group">
                                <label >Event</label>
                                <input type="text" className={this.state.error?"form-control error":"form-control"} value={this.state.eventMsg } onChange={this.OnChaneEvent} placeholder="Enter Event" />
                                {
                                    this.state.error?
                                        <small  className="form-text error text-muted">{this.state.errorMsg}</small>:""
                                }
                            </div>
                            
                            <button type="submit" onClick={this.onSubmit} className="btn btn-primary btn-block">Submit</button>
                        </form> 

                        </div>                        
                        </div>
                    </div>
                    </div>
                </div>
                :''}

            </div>

        );
    }
}
