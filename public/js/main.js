var app = new Vue({
	el: '#app',
	components: {
		Multiselect: window.VueMultiselect.default
	},
	data: {
		students: [],
		submitted_students: ['E12206'],
		companies: [],
		skills: [],
		skills_duringTraining: [],

		attitudeToHire_list: ["GPA", "Technical Skills", "Softskills", "IQ", "Leadership Qualities", "Punctuality"],
		attitudeToHire_selected: [],
		activeStudent: null,
		activeCompany: null,

		activeCompany_recommendToAnother: null,
		activeCompany_willJoinAfterDegree: null,

		rating: 0,
		ratingPunctuality: 0,
		ratingIQ: 0,
		ratingLeadership: 0,
		ratingTechnicalSkills: 0,
		ratingSoftskills: 0,

		interviews: [

		],
		new_interview_company: null,
		new_interview_state: null,

		messageVisible: false,
		messageText: 'Thank you for your valuable time!',
		messageHideTimeout: null,
	},
	methods: {
		getFormattedENumber: function(eNumber){
			if(eNumber == null){
				return null;
			}
			return eNumber.substring(0,1) + '/' + eNumber.substring(1,3) + '/' + eNumber.substring(3);
		},
		selectStudent: function(eNumber){
			this.activeStudent = eNumber;
			setTimeout(function(){
				scrollTo(document.body, 0, 300);
			}, 400);
		},
		clearStudent: function(){
			this.activeStudent = null;
		},
		initStudents: function(){
			axios.get('./data/students.json')
			.then(function(response){
				// console.log(response);
				app.students = response.data;
			})
			.catch(function(error){
				console.log(error);
			});
		},
		initCompanies: function(){
			axios.get('./data/companies.json')
			.then(function(response){
				// console.log(response);
				app.companies = response.data;
			})
			.catch(function(error){
				console.log(error);
			});
		},
		initSkills: function(){
			axios.get('./data/skills.json')
			.then(function(response){
				// console.log(response);
				app.skills = response.data;
			})
			.catch(function(error){
				console.log(error);
			});
		},
		getStudentsSubmitted: function(){
			
			axios.get('./studentinfo/submitted')
			.then(function(response){
				// console.log(response);
				app.submitted_students = _.map(response.data, 'activeStudent');
			})
			.catch(function(error){
				console.log(error);
			});

		},
		getRatingText: function(){
			switch(this.rating){
				case 1: return 'Bad!';
				case 2: return 'Below Average';
				case 3: return 'Average';
				case 4: return 'Above Average';
				case 5: return 'Great!';
				default: return 'Not rated yet'
			}
		},

		addSkill: function(skill){
			this.skills_duringTraining.push(skill);
			this.skills.push(skill);

		},
		addAttitudeToHire: function(attitude){
			this.attitudestohire.push(attitude);
			this.attitudetohire.push(attitude);
		},
		addCompany: function(company){
			this.companies.push(company);
			this.activeCompany = company;

		},
		setTrainingCompany: function(_company){
			this.activeCompany = _company;

		},

		setCompanyRating: function(_rating){
			this.rating = _rating;
		},
		setPunctualityRating: function(_rating){
			this.ratingPunctuality = _rating;
		},
		setIQRating: function(_rating){
			this.ratingIQ = _rating;
		},
		setLeadershipRating: function(_rating){
			this.ratingLeadership = _rating;
		},
		setTechnicalSkillsRating: function(_rating){
			this.ratingTechnicalSkills = _rating;
		},
		setSoftskillsRating: function(_rating){
			this.ratingSoftskills = _rating;
		},


		setNewInterview: function(_state){

			this.new_interview_state = _state;
			if(_.isNil(this.new_interview_company)){
				return;
			}
			this.interviews.push({
				'company': this.new_interview_company,
				'state': _state
			});

			this.new_interview_company = null;
			this.new_interview_state = null;
		},
		setExistingInterview: function(_id, _state){
			this.interviews[_id].state = _state;
		},
		isStudentSubmitted: function(student){
			if(_.indexOf(this.submitted_students, student) >= 0){
				return true;
			}
			return false;
		},
		messageDismiss: function(){
			this.messageVisible = false;
		},
		messageShow: function(message){
			if(app.messageVisible){
				app.messageVisible = false;
				setTimeout(function(){

					app.messageText = message.toString()
					app.messageVisible = true;

				}, 300);
			} else {
				this.messageText = message.toString()
				this.messageVisible = true;
			}
			clearTimeout(this.messageHideTimeout);
			this.messageHideTimeout = setTimeout(function(){
				app.messageVisible = false;
				setTimeout(function(){

					app.messageText = "It's Feedback time!";

				}, 300);
			}, 3000)
		}, 
		submitData: function(){

			if(_.isNil(this.activeStudent)){
				app.messageShow('Please select your E Number');
				return;
			}

			if(_.isNil(this.activeCompany)){
				app.messageShow('Please select your training company');
				return;
			}

			if(this.rating == 0){
				app.messageShow('Please rate your training company on a scale from 1 to 5');
				return;
			}

			if(this.ratingPunctuality == 0){
				app.messageShow('Please rate yourself on your punctuality from 1 to 5');
				return;
			}
			if(this.ratingIQ == 0){
				app.messageShow('Please rate yourself on your IQ from 1 to 5');
				return;
			}
			if(this.ratingLeadership == 0){
				app.messageShow('Please rate yourself on your leadership qualities from 1 to 5');
				return;
			}
			if(this.ratingTechnicalSkills == 0){
				app.messageShow('Please rate yourself on your technical skills from 1 to 5');
				return;
			}
			if(this.ratingSoftskills == 0){
				app.messageShow('Please rate yourself on your soft skills from 1 to 5');
				return;
			}

			var data = {
				'skills_duringTraining': this.skills_duringTraining,
				'activeStudent': this.activeStudent,
				'activeCompany': this.activeCompany,
				'interviews': this.interviews,
				
				'activeCompany_recommendToAnother': this.activeCompany_recommendToAnother,
				'activeCompany_willJoinAfterDegree': this.activeCompany_willJoinAfterDegree,

				'why_hired': this.attitudeToHire_selected,

				'rating_company': this.rating,

				'rating_Punctuality': this.ratingPunctuality,
				'rating_IQ': this.ratingIQ,
				'rating_Leadership': this.ratingLeadership,
				'rating_TechnicalSkill': this.ratingTechnicalSkill,
				'rating_Softskills': this.ratingSoftskills,
			}

			
			app.messageShow('Submitting.. Please wait.');
			axios.post('/studentinfo', data)
			.then(function(response){
				app.messageShow('Thank you for your support!');
				setTimeout(function(){
						location.reload();
					}, 2000);
			})
			.catch(function(error){
				app.messageShow('Looks like something went wrong...');
				console.log(error);

			})
		},
		fadeIn: function(student){
			var el = document.getElementById('student_' + student);
			el.style.opacity = 1;
		}
	},
	created: function(){
		this.initStudents();
		this.initCompanies();
		this.initSkills();
		this.getStudentsSubmitted();

		showPage();
	}
});

function showPage(){
	var toShow = document.getElementsByClassName('to-show');
	// console.log(toShow);
	for (var i = 0; i < toShow.length; i++) {
		toShow[i].style.display = '';
	}

	var page = document.getElementById('app');
	page.style.opacity = 1;
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}