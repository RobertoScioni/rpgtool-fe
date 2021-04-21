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
	 * Pages is a dictionary whose values are the content of the pages and whose keys are the name of the Pages
	 *
	 * content of a page is an array of object with at least a name field
	 *
	 * the presence of a macro field marks an entry as a macrobutton when pressed the macro will be sent to the chat
	 * the presence of a value field marks an entry as an input field
	 * a dsc field will have an action to show it's description in a modal
	 * a min and/or max field will mark and entry as a counter field //must yet be implemented in pages
	 * an entry with only it's name will be printed as is and have no event attached
	 * 
	 * all macros and counters are 'indexed' as variables so if i have the following in a page:
	 * 	{
	 * 		name:Strenght
	 * 		min:-18
	 * 		value:12
	 * 		max:+20
	 * 	},
	 * 	{
	 * 		name:Strenght modifier
	 * 		macro:[floor((@Strenght-10)/2)]
	 * 	}
	 * 
	 * 	then when i resolve  Strenght mofifier i will get [floor((12-10)/2)]
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
 * 		search:
 * 			the ability to search ANYTHING inside the sheet
 * 		add inventory support
 * 			how?
 * 			an inventory should work like a page and be a container of fields
 * 			fields of an inventory should have a quantity associated with them and a mass/bulk or other accumulator?
 * 		add notepage support
 * 			support for markup in notepage
 * 				visual markup editor in notepages
 * 		symplify data structure
 * 			macro and value should become the same field name
 * 			a fieldtype would be a better way to manage the different kind of fields
 * 		add "copy paste" support.
 * 			copy paste support would enable users to copy stuf from character to character or from a library to a character
 */

/*********
 * theoretical new simplified data structure for a single element
 */
const element=
	{ 
		'name':'string',//self explanatory, it is the name of the element described
		'type':'info'||'macro'||'formula'||'field'||'counter',//this is one of the supported datatypes
		'value':'string'||'integer',//value can be a string for macros and fields or a integer for counters
		'description':'string',//a long text description that explains the entry
		'abbreviation':'string',//a shortened name for the entry
		'pages':[//collection of page object in witch the element appears
			{//a page element
				'name':'string',//name of the page
				'sort':'integer',//manual position of the element in the page
			}
		],
		'min':'integer',//an integer
		'max':'integer',//an integer
		'Item':{//any field with an item value is considered an item
			'qty':'integer',//an integer that represents how many copy of the item are in the inventory
			'mass':'integer'//the weight of a single copy of the item
			}
	}

/*********
 * the datatypes:
 * 
 * the macro datatype represents an interactive rollable element it will generate a macro in the sheet.
 * 
 * the formula datatype represents a non interactive math formula it's not rollable but can be referenced as a variable and can reference variables
 * 		this exists for stuff like ability modifiers
 * 
 * the info datatype represents a non interactive item it will produce a simple text in the sheet.
 * 
 * the field datatype represents a fillable short string (it could be a condition name or in the case of fate a consequence)
 * 
 * the counter datatype represents an interactive 
 */

/****************************************************************
 * theoretical simplified sheet
 */

const sheet={
	'pages':['Strings'],//an array of strings containing all the page names
	'bars':['strings'],//an array of strings containing "bar names" a bar is an horizontal container visualized in all the pages
	'elements':['element']//an array of objects in the structure of elements
};

/*********
 * visual structure of the character sheet
 */

/*************************************
 * page1*page2*page3*      * FP * HP *
 *************************************
 * 				bar1                 *
 *************************************
 *				bar2				 *
 *************************************
 *			   bar ... n             *
 *************************************
 * self arranging elements as defined*
 * by the page field of the elements *
 * themselves                        *
 * 									 *
 * 									 *
 *************************************/