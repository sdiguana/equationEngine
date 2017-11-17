//Roark.Plates.Circular.Case
//process:
// Select Plate & Case
// js searches for independant variables -> generate input fields
// 
//P. 457 - Plate Constants


function getIndepVariables(condition) {
let bve = condition.boundaryValues;
let gve = condition.generalValues;
let pc = plateConstants;
let varStack  = [];
let indepVarStack = [];

function extractVars(eqList) {
let requiredVariables = [];
for(let i=0; i<eqList.length; i++) {
let exVar = extractVariables(eqList[i].value);
requiredVariables.push.apply(requiredVariables,exVar);
}
requiredVariables = requiredVariables.filter((v, i, a) => a.indexOf(v) === i).sort();
//console.log("Get Indy Vars: ");
//console.log(requiredVariables);
return requiredVariables;
}
//this fn name sucks, find a new one.
function registerEqns(keys) {
let eqns = [];
let orphans = [];

for(let i=0;i<keys.length;i++) {
	let isRegistered = false;
	for(let j=0;j<pc.length; j++) {
		if(pc[j].key === keys[i]) {
			eqns.push(pc[j]);
			isRegistered = true;
		}
	}
	if(!isRegistered) {orphans.push(keys[i]);}
}
let ev = extractVars(eqns);
orphans.push.apply(orphans,ev);
return orphans.filter((v, i, a) => a.indexOf(v) === i).sort();
}
function removeDependantVars(vList, nve){
	let indy = [];
	for(let i=0;i<vList.length;i++) {
		let isIndy = true;
		let val = vList[i];
		
		for(let j=0;j<nve.length; j++) {
			let key = nve[j].key;			
			if(key === val) { isIndy = false; }
		}
		if(isIndy) {indy.push(val);}
	}
	return indy;
}

//GVE Stack
let gveVars = extractVars(gve);
//BVE Stack
let bveVars = extractVars(bve);

let usedPC = [];
//get the used GV
for(let i=0; i<pc.length;i++) {
    for(let j=0; j<gveVars.length;j++) {
        if(pc[i].key == gveVars[j]){usedPC.push(pc[i]);}
    }
}
//get the used BV
    for(let i=0; i<pc.length;i++) {
        for(let j=0; j<bveVars.length;j++) {
            if(pc[i].key == bveVars[j]){usedPC.push(pc[i]);}
        }
    }
usedPC = usedPC.filter((v, i, a) => a.indexOf(v) === i).sort();
console.log(usedPC);
let pceb = registerEqns(bveVars);
pceb = removeDependantVars(pceb, bve);

let pceg = registerEqns(gveVars);
pceg = removeDependantVars(pceg, gve);
pceg = removeDependantVars(pceg, bve);
//PROBLEM: M_(rb) is not accounted for because it resolves to M_rb in the regexs. Need to Filter Keys for parens.
let iv = [];
iv.push.apply(iv,pceb);
iv.push.apply(iv,pceg);
iv = iv.filter((v, i, a) => a.indexOf(v) === i).sort();
console.log(iv);
generateFormInputs(iv);
renderEquations(usedPC, "pc");
renderEquations(case1a.boundaryValues, "bv");
renderEquations(case1a.generalValues, "gv");

}



let plateConstants = [
	{key: "D", value: "(E * t^3)/12 * (1 - nu^2)"},
	
	{key: "F_1", value: "(1+nu)/2 * b/r * ln(r / b) + (1 - nu) / 4 * (r/b-b/r)"},
	{key: "F_2", value: "1/4 * [1-(b/r)^2*(1-2*ln(r/b)]"},
	{key: "F_3", value: "b/(4*r) * \{[(b/r)^2+1] * ln(r/b) + (b/r)^2 -1  \}"},
	{key: "F_4", value: "1/2 * [(1+nu) * b/r + (1 - nu) * r/b]"},
	{key: "F_5", value: "1/2 * [1 - (b/r)^2]"},
	{key: "F_6", value: "b/(4*r) * [(b/r)^2 - 1 + 2 * ln(r/b)]"},
	{key: "F_7", value: "1/2 * (1-nu^2) * (r/b-b/r)"},
	{key: "F_8", value: "1/2*[1+nu+(1-nu)*(b/r)^2]"},
	{key: "F_9", value: "b/r * \{ (1+nu)/2 * ln(r/b) +(1-nu)/4 * [1-(b/r)^2]\}"},
	
	{key: "C_1", value: "(1+nu)/2 * b/a * ln(a/b)+ (1-nu)/4 + (a/b-b/a)"},
	{key: "C_2", value: "1/4*[1-(b/a)^2 * (1+2*ln(a/b))]"},
	{key: "C_3", value: "b/(4*a) * \{ [(b/a)^2+1] * ln(a/b) + (b/a)^2 - 1 \}"},
	{key: "C_4", value: "1/2 * [(1+nu)*(b/a)+(1-nu)*(a/b)]"},
	{key: "C_5", value: "1/2 * [1 - (b/a)^2]"},
	{key: "C_6", value: "b/(4*a) * [(b/a)^2 - 1 + 2 * ln(a/b)]"},
	{key: "C_7", value: "1/2 * (1-nu^2)*(a/b-b/a)"},
	{key: "C_8", value: "1/2 * [1+nu+(1-nu)*(b/a)^2]"},
	{key: "C_9", value: "b/a* \{ (1+nu)/2 * ln(a/b)+(1-nu)/4*[1-(b/a)^2] \}"},
	
	{key: "L_1", value: "(1+nu)/2 * r_0/a * ln(r_0/a) + (1-nu)/4 * (a/r_0-r_0/a)"},
	{key: "L_2", value: "1/4 * [1 - (r_0/a)^2 * (1+2*ln(a/r_0)]"},
	{key: "L_3", value: "r_0/(4*a) * \{ [ (r_0/a)^2+1 ] * ln(a/r_0) +(r_0/a)^2 -1 \}"},
	{key: "L_4", value: "1/2 * [(1+nu)*(r_0/a)+(1-nu)*(a/r_0)]"},
	{key: "L_5", value: "1/2[1-(r_0/a)^2]"},
	{key: "L_6", value: "r_0/(4*a) * [ (r_0/a)^2 -1 + 2* ln(a/r_0) ]"},
	{key: "L_7", value: "1/2*(1-nu^2)*(a/r_0-r_0/a)"},
	{key: "L_8", value: "1/2*[ 1+ nu + (1-nu)*(r_0/a)^2 ]"},
	{key: "L_9", value: "r_0/a * \{ (1+nu)/2 * ln(a/r_0)+(1-nu)/4*[ 1 - (r_0/a)^2 ] \}"},
	{key: "L_11", value: "1/64* \{ 1+4*(r_0/a)^2-5*(r_0/a)^4-4*(r_0/a)^2*[ 2+(r_0/a)^2 ] * ln(a/r_0) \}"},
	{key: "L_12", value: "a/(14400*(a-r_0))* \{ 64-225*r_0/a - 100(r_0/a)^3+261*(r_0/a)^5+60*(r_0/a)^3*[3*(r_0/a)^2+10]*ln(a/r_0) \}"},
	{key: "L_13", value: "a^2/(14400*(a-r_0)^2)* \{ 25-128(r_0/a) + 225*(r_0/a)^2 - 25*(r_0/a)^4 - 97(r_0/a)^6 - 60(r_0/a)^4*[5+(r_0/a)^2] *ln(a/r_0)\}"},
	{key: "L_14", value: "1/16 * [ 1 - (r_0/a)^4 - (r_0/a)^2 ln(a/r_0) ]"},
	{key: "L_15", value: "a/(720(a-r_0)) * [ 16 - 45*(r_0/a)+ 9*(r_0/a)^5 +20*(r_0/a)^3*(1+3*ln(a/r_0))]"},
	{key: "L_16", value: "a^2/(1440*(a-r_0)^2) * [ 15-64*(r_0/a)+ 90*(r_0/a)^2 -6*(r_0/a)^6 -5*(r_0/a)^4 *(7+12*ln(a/r_0))]"},
	{key: "L_17", value: "1/4 * \{ 1-(1-nu)/4*[ 1-(r_0/a)^4 ] - (r_0/a)^2*[ 1+(1+nu)*ln(a/r_0) ] \}"},
	{key: "L_18", value: "a/(720*(a-r_0)) * \{ [ 20*(r_0/a)^3+16 ] * (4+nu) -45*(r_0/a)*(3+nu) -9*(r_0/a)^5*(1-nu)+60*(r_0/a)^3*(1+nu)*ln(a/r_0)  \}"},
	{key: "L_19", value: "a^2/(1440*(a-r_0)^2) * [ 15*(5+nu)-64*(r_0/a)*(4+nu)+90*(r_0/a)^2*(3+nu) -5*(r_0/a)^4*(19+7*nu)+6*(r_0/a)^6*(1-nu)-60*(r_0/a)^4*(1+nu)*ln(a/r_0)]"},
	
	{key: "G_1", value: "[(1+nu)/2*r_0/r*ln(r/r_0)+(1-nu)/4*(r/r_0-r_0/r)]<r-r_0>^0"},
	{key: "G_2", value: "1/4*[1-(r_0/r)^2*(1+2*ln(r/r_0))]*<r-r_0>^0"},
	{key: "G_3", value: "r_0/(4*r)*\{ [(r_0/r)^2+1]*ln(r/r_0)+(r_0/r)^2-1 \} *<r-r_0>^0"},
	{key: "G_4", value: "1/2*[(1+nu)*(r_0/r)+(1-nu)*(r/r_0)] *<r-r_0>^0"},
	{key: "G_5", value: "1/2*[1-(r_0/r)^2] *<r-r_0>^0"},
	{key: "G_6", value: "r_0/(4*r)*[(r_0/r)^2-1+2*ln(r/r_0)] *<r-r_0>^0"},
	{key: "G_7", value: "1/2*(1-nu^2)*(r/r_0-r_0/r) *<r-r_0>^0"},
	{key: "G_8", value: "1/2*[1+nu+(1-nu)*(r_0/r)^2] *<r-r_0>^0"},
	{key: "G_9", value: "r_0/r* \{ (1+nu)/2 * ln(r/r_0) + (1-nu)/4 * [1-(r_0/r)^2] \} *<r-r_0>^0"},
	{key: "G_11", value: "1/64 * \{ 1+4*(r_0/r)^2-5*(r_0/r)^4-4*(r_0/r)^2*[2+(r_0/r)^2]*ln(r/r_0) \} *<r-r_0>^0"},
	{key: "G_12", value: "(r*<r-r_0>^0)/(14400*(r-r_0))*\{ 64-225*(r_0/r)-100*(r_0/r)^3 +261*(r_0/r)^5+60*(r_0/r)^3*[3*(r_0/r)^2+10]*ln(r/r_0) \}"},
	{key: "G_13", value: "(r^2*<r-r_0>^0)/(14400*(r-r_0)^2)*\{ 25-128*(r_0/r)*+225*(r_0/r)^2-25*(r_0/r)^4-97*(r_0/r)^6-60*(r_0/r)^4*[5+*(r_0/r)^2]*ln(r/r_0) \}"},
	{key: "G_14", value: "1/16*[1-*(r_0/r)^4-4*(r_0/r)^2*ln(r/r_0)]*<r-r_0>^0"},
	{key: "G_15", value: "(r*<r-r_0>^0)/(720*(r-r_0))*[16-45*(r_0/r)+9*(r_0/r)^5+20*(r_0/r)^3*(1+3*ln(r/r_0)]"},
	{key: "G_16", value: "(r^2*<r-r_0>^0)/(1440*(r-r_0)^2)*[15-64*(r_0/a)+90*(r_0/r)^2-6*(r_0/r)^6-5*(r_0/r)^4*(7+12*ln(r/r_0)]"},
	{key: "G_17", value: "1/4* \{ 1-(1-nu)/4*[1-*(r_0/r)^4]-(r_0/r)^2*[1+(1+nu)*ln(r/r_0)] \} * <r-r_0>^0"},
	{key: "G_18", value: "(r*<r-r_0>^0)/(720*(r-r_0)) * \{ [20*(r_0/r)^3+16]*(4+nu)-45*(r_0/r)*(3+nu)-9*(r_0/r)^5*(1-nu)+60*(r_0/r)^3*(1+nu)*ln(r/r_0) \}"},
	{key: "G_19", value: "(r^2*<r-r_0>^0)/(1440*(r-r_0)^2) * [15*(5+nu)-64*(r_0/r)*(4+nu)+90*(r_0/r)^2*(3+nu)-5*(r_0/r)^4*(19+7*nu)+6*(r_0/r)^6*(1-nu)-60*(r_0/r)^4*(1+nu)*ln(r/r_0)]"}
];

//P. 459 - Case 1a: Outer Edge Simply Supported, Inner Edge Free
let case1a = {
boundaryValues: [
	{key: "M_(rb)", value: 0},
	{key: "Q_b", value: 0},
	{key: "y_a", value: 0},
	{key: "M_(ra)", value: 0},
	{key: "y_b", value: "-(w*a^3)/D*((C_1*L_9)/C_7-L_3)"},
	{key: "theta_b", value: "(w*a^2)/(D*C_7)*L_9"},
	{key: "theta_a", value: "(w*a^2)/D*((C_4*L_9)/C_7-L_6)"},
	{key: "Q_a", value: "-w * r_0 / a"}
],
generalValues: [
	{key: "y", value: "y_b + theta_b * r * F_1 * + M_(rb) * r^2 / D * F_2 + Q_b * r^3 / D * F_3 + -w* r^3 / D * G_3"},
	{key: "theta", value: "theta_b * F_4 + M_(rb) * r / D * F_5 + Q_b * r^2 / D * F_6 - w * r^2 / D * G_6 "},
	{key: "M_r", value: "theta_b * D / r * F_7 + M_(rb) * F_8 + Q_b * r* F_9 - w * r * G_9"},
	{key: "M_t", value: "(theta * D * (1-nu^2) )/ r + nu * M_r"},
	{key: "Q", value: "Q_b * b / r - w * r_0 / r * <r-r_0>^0"}
]
};
//pcli();
//bvli();
//gvli();
function renderEquations(eqList, idTag) {
    for(let i=0; i<eqList.length; i++) {
        let txt = `\`${eqList[i].key.toString()} = ${eqList[i].value}\``;
        appendElement(document.getElementById(idTag), "li", txt);
    }
}

function pcli() {
	for(let i=0; i<plateConstants.length; i++) {
		let txt = `\`${plateConstants[i].key.toString()} = ${plateConstants[i].value}\``;
		appendElement(document.getElementById("pc"), "li", txt);
	}
}

function bvli() {
	for(let i=0; i<boundaryValues.length; i++) {
		let txt = `\`${boundaryValues[i].key.toString()} = ${boundaryValues[i].value}\``;
		appendElement(document.getElementById("bv"), "li", txt);
	}
}

function gvli() {
	for(let i=0; i<generalValues.length; i++) {
		let txt = `\`${generalValues[i].key.toString()} = ${generalValues[i].value}\``;
		appendElement(document.getElementById("gv"), "li", txt);
	}
}
function appendElement(parent, type, text) {
    let child = document.createElement(type);
    if(text.length > 0 || text !== null) {
        child.appendChild(document.createTextNode(text));
    }
    parent.appendChild(child);
    return child;
}

function findTerminalNodes(fnList) {
// pass in a list of the subcase boundaries & general case expressions (should this be bList and gList?? Or should I pass Case & Subcase??)
// make a DAG pushing down to terminal child nodes, recursively searching

return independantNodes; // returns a list terminal independent child nodes
}
/*
//TEST EXECUTION
let testIndyVars = ["a","r_0", "t", "E", "nu"];
generateFormInputs(testIndyVars);
let testCBoxes = ["M_(rb)", "y_b"];
generateCheckBoxOutputs(testCBoxes);
let exVs = extractVariables(generalValues[0].value);
for(let i=0; i<exVs.length; i++) {
    appendElement(document.getElementById("exVarTest"), "li", exVs[i]);
}
*/
function generateFormInputs(indyVarList) {
let f = document.getElementById("userInputs");
	for(let i=0; i<indyVarList.length; i++) {
		let idText = indyVarList[i];
		let displayText = `\`${idText}\``;
		let label = appendElement(f, "label", displayText);
		label.for = idText;
		let txtField = appendElement(f, "input","");
		txtField.className += "form-control";
        txtField.type = "text";
		txtField.Id = idText;
        txtField.name = idText;

		// add a valueChangedListener
	}
}

function generateCheckBoxOutputs(outputVars) {
    let f = document.getElementById("inputForm");

    outputVars.splice(0,0,"ALL", "NONE"); // indexAt, deleteCount, item01, item02...

    for(let i=0; i<outputVars.length; i++) {
        let idText = outputVars[i];
        let displayText = `\`${outputVars[i]}\``;
        let cBox = appendElement(f, "input","");
        cBox.type = "checkbox";
        cBox.name = idText;
        cBox.value = idText;
        let label = appendElement(f, "label", displayText);
        label.for = idText;
    }
}

function getCheckedBoxes(cBoxes) {
    let chkdList = [];
    for (let i=0; i<cBoxes.length; i++) {
        if (cBoxes[i].checked) {
            chkdList.push(cBoxes[i]);
        }
    }
    return cBoxes.length > 0 ? cBoxes : null;
}


function updateActiveEquations(eqList) {
//clear the ul
// display all active equations on the page as <li>
//populate with values
}
extractVariables("y_b + theta_b * r * F_1 * + M_(rb) * r^2 / D * F_2 + Q_b * r^3 / D * F_3 + -w* r^3 / D * G_3");

function extractVariables(exStr) {
	exStr = exStr.toString(); // sometimes a number sneaks in
	exStr = exStr.replace(/(ln)*/g, ''); // todo: eliminate natural log - need to improve for exp, pi etc
	
	let s = exStr.match(/([a-zA-Z]+[0-9]*[\_]?[\(]?[a-zA-Z0-9]*)/g) || "";
	if(s.length <1) {return;} // return if no matches
	
	//remove residual open parens
	//s.forEach(ln => ln.replace("(",""));
	for(let i=0; i<s.length;i++) {
		s[i] = s[i].replace(/[\(]/g,'');	
	}	
    // reduce to unique items
    s = s.filter((v, i, a) => a.indexOf(v) === i); // https://stackoverflow.com/questions/1960473/unique-values-in-an-array
    return s.length > 0 ? s : null;

	// I have a string array which has possible rogue open parens in its strings, which I want to remove. I had attempted to do so with a lambda, but failed... After working it out with a for loop, I realized that I need to re-assign the value of the string to the result of the s.replace(). How can I do this in a lambda?
	// working for loop:	
	//for(let i=0; i<s.length;i++) {
	//	s[i] = s[i].replace(/[\(]/g,'');	
	//}
	// Incorrectly written lambda:
	//s.forEach(n => n.replace('(',''));

}

//https://regex101.com/
//([a-zA-Z]+[0-9]*[\_]?[\(]?[a-zA-Z0-9]*)
//Group Letters: (...)
// One+ Letters [a-zA-Z]+
// followed by Zero+ numbers
// followed by 0-1 underscore
// followed by 0-1 open parens
// followed by zero+ letters or numbers
//NOTE: MUST Clean the open paren after this regex
getIndepVariables(case1a);