import React from 'react';
import {
  Link,
  Redirect
} from 'react-router-dom';
import Say from 'react-say';
import { SayButton } from 'react-say';

class Spell extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      allCards: [],
      remainingAndFamiliar: [],
      remainingCards: [],
      familiarCards: [],
      masteredCards: [],
      twoArr: this.shuffle([0, 1]),
      threeArr: this.shuffle([0, 1, 2]),
      fourArr: this.shuffle([0, 1, 2, 3]),
      optionsCls: "options-modal",
      optStarred: false,
      allCls: "options-selected",
      starredCls: "options-unselected",
      optAnsType: "Term",
      optQType: ["flash", "written", "choice"],
      optAudio: false,
      offCls: "options-selected",
      onCls: "options-unselected",
      lastAnswer: null,
      lastQuestion: null,
      correct: null,
      spellVal: "",
      wordToSpell: null
    };

  }

  componentDidMount() {
    let that = this;
    this.props.fetchCards(this.props.match.params.deckId)
      .then(() => this.props.fetchCardStudies(this.props.match.params.deckId))
      .then(() => {
        const rem = [];
        const fam = [];
        const mast = [];
        for (let i = 0; i < this.props.cards.length; i++) {
          const card = this.props.cards[i];
          if (card.spellCount === 0) rem.push(card);
          if (card.spellCount === 1) fam.push(card);
          if (card.spellCount === 2) mast.push(card);
        }
        const remAndFam = rem.concat(fam);
        const rFShuffled = that.shuffle(remAndFam)
        this.setState({ allCards: Object.assign([], that.props.cards), remainingAndFamiliar: rFShuffled, wordToSpell: rFShuffled[0], remainingCards: rem, familiarCards: fam, masteredCards: mast })
        
      });
    
  }

  handleRedirect(deckId) {
    return e => {
      this.setState({ redirect: `/${deckId}/flash-cards` })
    }
  }

  goBackPage() {
    this.props.history.goBack();
  }

  showModal() {
    if (this.state.optionsCls === "options-modal") {
      this.setState({ optionsCls: "options-modal show-modal" })
    }
  }

  hideModal(e) {
    if (e.target.className === "options-modal show-modal" ||
      e.target.className === "options-close-form") {
      this.setState({ optionsCls: "options-modal" })
    }
  }

  handleAnswerTypeChange() {
    if (this.state.optAnsType === "Term") {
      this.setState({ optAnsType: "Definition" });
    } else {
      this.setState({ optAnsType: "Term" });
    }
  }

  handleStudyStarredChange(opt) {
    return e => {
      if (opt === "All") {
        this.setState({ allCls: "options-selected", starredCls: "options-unselected" });
      } else {
        this.setState({ starredCls: "options-selected", allCls: "options-unselected" });
      }
    }
  }

  handleAudioChange(opt) {
    return e => {
      if (opt === "Off") {
        this.setState({ offCls: "options-selected", onCls: "options-unselected" });
      } else {
        this.setState({ onCls: "options-selected", offCls: "options-unselected" });
      }
    }
  }

  resetDecks() {
    this.setState({
      lastAnswer: null,
      lastQuestion: null,
      correct: null,
      remainingAndFamiliar: this.shuffle(this.state.remainingAndFamiliar),
      allCards: this.shuffle(this.state.allCards)
    });
  }

  resetProgress() {
    for (let i = 0; i < this.state.allCards.length; i++) {
      const card = this.state.allCards[i];
      this.props.updateCardStudy({ id: card.cardStudyId, spellCount: 0 }).then(() => this.props.fetchCardStudies(this.props.match.params.deckId));
    }
    const acShuffled = this.shuffle(this.state.allCards);
    this.setState({
      lastAnswer: null,
      lastQuestion: null,
      correct: null,
      remainingCards: acShuffled,
      familiarCards: [],
      masteredCards: [],
      remainingAndFamiliar: acShuffled,
      allCards: acShuffled,
      wordToSpell: acShuffled[0],
      spellVal: ""
    });
  }

  shuffle(array) {
    let shuffled = Object.assign([], array);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  checkSpelling() {
    if (this.state.wordToSpell.term.toLowerCase() === this.state.spellVal.toLowerCase()) {
      const card = Object.assign({}, this.state.wordToSpell);
      card.spellCount += 1;
      card.correctnessCount += 1;
      this.props.updateCardStudy({ id: card.cardStudyId, correctnessCount: card.correctnessCount, spellCount: card.spellCount }).then(() => this.props.fetchCardStudies(this.props.match.params.deckId));
      let remCards = Object.assign([], this.state.remainingCards);
      let famCards = Object.assign([], this.state.familiarCards);
      let mastCards = Object.assign([], this.state.masteredCards);
      if (card.spellCount === 1) {
        remCards = this.state.remainingCards.filter(cd => cd.cardStudyId !== card.cardStudyId);
        famCards.push(card);
        this.setState({
          remainingCards: remCards,
          familiarCards: famCards
        });
      }
      if (card.spellCount === 2) {
        famCards = this.state.familiarCards.filter(cd => cd.cardStudyId !== card.cardStudyId);
        mastCards.push(card)
        this.setState({
          familiarCards: famCards,
          masteredCards: mastCards
        });
      }
      const rFShuffled = this.shuffle(remCards.concat(famCards))
      this.setState({
        correct: true,
        remainingAndFamiliar: rFShuffled,
        allCards: this.shuffle(this.state.allCards)
      });
      // if (remCards.concat(famCards).length !== 0) {
        setTimeout(() => {
          this.setState({
            spellVal: "",
            wordToSpell: this.state.remainingAndFamiliar[0],
            correct: null
          })
        }, 1000);
      // } else {
      //   this.setState({
      //     correct: null
      //   })
      // }

    } else {
      const lastAns = this.state.spellVal;
      this.setState({ lastAnswer: lastAns, lastQuestion: this.state.wordToSpell, spellVal: ""})
    }
  }

  handleSpellChange(e) {
    e.preventDefault();
    this.setState({spellVal: e.target.value});
  }


  render() {

    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }
    
    if (this.state.allCards.length === 0) return null;


    
    const textstyle = {
      play: {
        hover: {
          backgroundColor: 'black',
          color: 'white'
        },
        button: {
          padding: '4',
          fontFamily: 'Helvetica',
          fontSize: '1.0em',
          cursor: 'pointer',
          pointerEvents: 'none',
          outline: 'none',
          backgroundColor: 'inherit',
          border: 'none'
        },
      }
    };
    debugger
    return (
      <div className="learn">
        <div className="game-sidebar">
          <div className="game-sidebar-back">
            <div onClick={this.goBackPage.bind(this)} className="go-back">
              <i className="fas fa-caret-left"></i>
              <p>Back</p>
            </div>
            <span className="game-sidebar-header">
              <i className="fas fa-volume-up"></i>
              <p>SPELL</p>
            </span>
            <div className="learn-mastery-counts">
              <div className="learn-mastery-remaining">
                <span>{this.state.remainingCards.length}</span>
                <p>REMAINING</p>
                <i className="fas fa-long-arrow-alt-down"></i>
              </div>
              <div className="learn-mastery">
                <span id={`learn-familiar-${this.state.familiarCards.length}`}>{this.state.familiarCards.length}</span>
                <div><p>FAMILIAR</p><i className="fas fa-check"></i></div>
                <i className="fas fa-long-arrow-alt-down"></i>
              </div>
              <div className="learn-mastery">
                <span id={`learn-mastery-${this.state.masteredCards.length}`}>{this.state.masteredCards.length}</span>
                <div><p>MASTERED</p><i className="fas fa-check-double"></i></div>
              </div>
            </div>
          </div>
          <div onClick={this.showModal.bind(this)} className="learn-options-button">
            <i className="fas fa-sliders-h"></i>
            <span>Options</span>
          </div>
          <div onClick={this.hideModal.bind(this)} className={this.state.optionsCls}>
            <div className='options-div-box'>
              <div className="options-banner">
                <h1 className="form-title">Options</h1>
                <div onClick={this.hideModal.bind(this)} className="options-close-form">X</div>
              </div>
              <div className="options-content">
                <div className="options-top">
                  <div className="options-radio-div">
                    <span>STUDY STARRED</span>
                    <div>
                      <button onClick={this.handleStudyStarredChange("All").bind(this)} className={this.state.allCls} >All</button>
                      <button onClick={this.handleStudyStarredChange("Starred").bind(this)} className={this.state.starredCls}>Starred</button>
                    </div>
                  </div>
                  {/* <span>ANSWER WITH</span>
                  <label>Term
                    <input type="checkbox" checked="checked"/>
                    <span className="checkmark"></span>
                  </label>
                  <label>Definition
                    <input type="checkbox" checked="checked"/>
                    <span className="checkmark"></span>
                  </label>
                    */}
                  <div className="options-audio-div options-field">
                    <span>ANSWER WITH</span>
                    <select value={this.state.optAnsType} onChange={this.handleAnswerTypeChange.bind(this)}>
                      <option value="Term">
                        Term
                        </option>
                      <option value="Definition">Definition</option>
                    </select>
                  </div>
                </div>
                <div className="options-middle">

                </div>
                <div className="options-bottom">
                  <div className="options-radio-div">
                    <span>AUDIO</span>
                    <div>
                      <button onClick={this.handleAudioChange("Off").bind(this)} className={this.state.offCls}>Off</button>
                      <button onClick={this.handleAudioChange("On").bind(this)} className={this.state.onCls}>On</button>

                    </div>
                  </div>
                  <div className="options-reset-div">
                    <span>RESET PROGRESS</span>
                    <div>
                      <p>START OVER</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="learn-card">
          <div className="spell-card-inner">
            {this.state.allCards.length === this.state.masteredCards.length && !this.state.correct?
              <div className="learn-finished">
                <span>🏆</span>
                <h1>Congratulations, you've learned everything!</h1>
                <p>Keep reviewing your terms to make sure they stick</p>
                <button onClick={this.resetProgress.bind(this)} >Review</button>
                <Link to={`/${this.state.allCards[0].deckId}/flash-cards`}>Finish</Link>
              </div>
              :
              <>
                {/* for wrong answer */}
                {this.state.lastAnswer ?
                  <div className="learn-wrong-answer">
                    <Say text={`${this.state.wordToSpell.term}. ${this.state.wordToSpell.term.split("").join(", ")}`} />
                    <div className="learn-wrong-answer-top">
                      <span>😕 Study this one!</span>
                    </div>
                    <div className="learn-wrong-answer-mid">
                      {/* <span>DEFINTION</span>
                      <div>
                        <p>{this.state.lastQuestion.definition}</p>
                        <SayButton
                          
                          onClick={event => console.log(event)}
                          text={`${this.state.lastQuestion.definition}`}
                        >
                          <i className="fas fa-volume-up"></i>
                        </SayButton>
                      </div> */}
                      <span>CORRECT ANSWER</span>
                      <div>
                        <p>{this.state.lastQuestion.term}</p>
                        <SayButton
                          onClick={event => console.log(event)}
                          text={`${this.state.lastQuestion.term}`}
                        >
                          <i className="fas fa-volume-up"></i>
                        </SayButton>
                      </div>
                    </div>
                    <div className="learn-wrong-answer-bottom">
                      <span>YOU SAID</span>
                      <div>
                        <p>{this.state.lastAnswer}</p>
                        <SayButton
                          onClick={event => console.log(event)}
                          text={`${this.state.lastAnswer}`}
                        >
                          <i className="fas fa-volume-up"></i>
                        </SayButton>
                      </div>
                      <button onClick={this.resetDecks.bind(this)} >Continue</button>
                    </div>
                  </div>
                  : this.state.correct ? 
                  <div>
                    <Say text="Correct" /> 
                      <div className="spell-field">
                        <SayButton
                          onClick={event => console.log(event)}
                          text={`${this.state.wordToSpell.term}`}
                        >
                          <i className="fas fa-volume-up"></i>
                        </SayButton>
                        <form onSubmit={this.checkSpelling.bind(this)}>
                          <input className="spell-field-green" onChange={this.handleSpellChange.bind(this)} type="text" placeholder="Type what you hear" spellCheck="false" value={this.state.spellVal} />
                          <label>ANSWER</label>
                          <input type="submit" value="" />
                        </form>
                      </div>
                      <div className="spell-card-answers">
                        <p>{this.state.wordToSpell.definition}</p>
                      </div>
                  </div>
                  :
                  <>
                    <div className="spell-field">
                      <Say text={`${this.state.wordToSpell.term}`} />
                        <SayButton
                          onClick={event => console.log(event)}
                          text={`${this.state.wordToSpell.term}`}
                          >
                          <i className="fas fa-volume-up"></i>
                        </SayButton>
                      <form onSubmit={this.checkSpelling.bind(this)}>
                        <input onChange={this.handleSpellChange.bind(this)} type="text" placeholder="Type what you hear" spellCheck="false" value={this.state.spellVal} autoFocus/>
                        <label>ANSWER</label>
                        <input type="submit" value=""/>
                      </form>
                    </div>
                    <div className="spell-card-answers">
                      <p>{this.state.wordToSpell.definition}</p>
                    </div>
                  </>
                }
              </>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Spell;