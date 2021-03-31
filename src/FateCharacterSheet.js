/*************
 * Sample Sheet for Fate Core
 */
const Zird = {
	/*********
	 * Counters is reserved for frequently changing values
	 * that will be visualized in the top right corner of the
	 * character sheet and be accessible from all the pages
	 */

	Counters: [
		{
			name: "Physical Stress",
			min: 0,
			value: 0,
			max: 2,
			abbreviation: "PS",
		},
		{
			name: "Mental Stress",
			min: 0,
			value: 0,
			max: 2,
			abbreviation: "MS",
		},
		{ name: "Fate Points", min: 0, value: 2, max: 2, abbreviation: "FP" },
	],
	/**********
	 * Pages is a disctionary whose values are the content of the pages and whose keys are the name of the Pages
	 *
	 * content of a page is an array of object with at least a name field
	 *
	 * the presence of a macro field marks an entry as a macrobutton when pressed the macro will be sent to the chat
	 * the presence of a value field marks an entry as an input field
	 * a dsc field will have an action to show it's description in a modal
	 * a min and/or max field will mark and entry as a counter field
	 * an entry with only it's name will be printed as is and have no event attached
	 */
	Pages: {
		Skills: [
			{ name: "Lore", macro: "[4dF+4]" },
			{ name: "Rapport", macro: "[4dF+3]" },
			{ name: "Crafts", macro: "[4dF+3]" },
			{ name: "Athletics", macro: "[4dF+2]" },
			{ name: "Will", macro: "[4dF+2]" },
			{ name: "Investigate", macro: "[4dF+2]" },
			{ name: "Fight", macro: "[4dF+1]" },
			{ name: "Resources", macro: "[4dF+1]" },
			{ name: "Contacts", macro: "[4dF+1]" },
			{ name: "Notice", macro: "[4dF+1]" },
		],
		Aspects: [
			{ name: "Wizard for hire" },
			{ name: "Rivals in the collegia arcana" },
			{ name: "If i haven't been there, i've read about it" },
			{ name: "not the face!" },
			{ name: "doesn't suffer fools gladly" },
		],

		Consequences: [
			{ name: "Mild", value: "" },
			{ name: "Moderate", value: "" },
			{ name: "Severe", value: "" },
		],
		extras: [],
		Stunts: [
			{
				name: "Scholar,healer",
				dsc: "can attempt physical recovery using Lore",
			},
			{
				name: "Friendly Liar",
				dsc:
					"Can use Rapport in place of Deceive to create advantages predicated on a lie.",
			},
			{
				name: "The Power of Deduction",
				dsc: ` 
					Once per scene you can spend a fate point
					(and a few minutes of observation) to make 
					a special Investigate roll 
					representing your potent deductive faculties.
					For each shift you make on this roll you discover 
					or create an aspect, on either the scene or	
					the target of your observations, 
					though you may only invoke one of them for free.
				`,
			},
			{
				name: "I’ve Read about That!",
				dsc: `
					You’ve read hundreds—if not thousands—of
					books on a wide variety of topics. 
					You can spend a fate point to use
					Lore in place of any other skill 
					for one roll or exchange, provided you
					can justify having read about 
					the action you’re attempting.
				`,
			},
		],
	},
}

/*********
 * to do
 * add support to variables in macros
 * 		why?
 * 			variables whould give the players the ability to define stuff like proficiency and ability modifiers
 * 		how?
 * 			variables will be declared in an object called variables and they will need to have simple values supported by rpg-dice-roller
 * 			a field called Formulas will contain frequently used calculations that reference variables
 * 			being able to simply parse them at rendering whould be optimal but most probably we will have to parse them when we store them
 */

const exampleWithVariables={
	Variables: {str:18,dex:10,con:12,int:10,wis:12,cha:15,Proficiency:2,level:1},
	Formulas:{mInt:"[floor((int-10)/2)]",mStr:"[floor((str-10)/2)]"}
	Counters:{}
	Pages:{},

}