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
		extracurricularactivities: [],
		extracurriculars: [],
		cocurricularactivities: [],
		cocurriculars: [],
		attitudestohire: [],
		attitudetohire: [],
		activeStudent: null,
		activeCompany: null,
		rating: 0,
		punctualityrating: 0,
		IQrating: 0,
		leadershiprating: 0,
		gparating: 0,
		softskillrating: 0,

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
		addextracurricular: function(extracurricular){
			this.extracurricularactivities.push(extracurricular);
			this.extracurriculars.push(extracurricular);
		},
		addcocurricular: function(cocurricular){
			this.cocurricularactivities.push(cocurricular);
			this.cocurriculars.push(cocurricular);
		},
		addattitude: function(attitude){
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
		setpunctualityrating: function(_rating){
			this.punctualityrating = _rating;
		},
		setIQrating: function(_rating){
			this.IQrating = _rating;
		},
		setleadershipskillsrating: function(_rating){
			this.leadershiprating = _rating;
		},
		setGPAratings: function(_rating){
			this.gparating = _rating;
		},
		setsoftskillsrating: function(_rating){
			this.softskillrating = _rating;
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

			var data = {
				'skills_duringTraining': this.skills_duringTraining,
				'activeStudent': this.activeStudent,
				'activeCompany': this.activeCompany,
				'rating': this.rating,
				'interviews': this.interviews,
				'extracurricularactivities': this.extracurricularactivities,
				'cocurricularactivities': this.cocurricularactivities,
				'attitudestohire': this.attitudestohire,
				'punctualityrating': this.punctualityrating,
				'IQrating': this.IQrating,
				'leadershiprating': this.leadershiprating,
				'gparating': this.gparating,
				'softskillrating': this.softskillrating,
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