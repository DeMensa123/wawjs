const XLSX = require("xlsx");
const debug = require("debug")("test");
const assert = require("assert");

describe("FP - array functions", function() {

  const xlsx = XLSX.readFile(`${__dirname}/data/Students.xlsx`)
  const studentsSheet = xlsx.Sheets['Sheet1'];
  const students = XLSX.utils.sheet_to_json(studentsSheet);

  it("01-xlsx library can load excel files as [] of objects", () => {
    //debug(JSON.stringify(students, null, 2));
    debug(students);
    assert(Array.isArray(students));
    console.log()
  });

  it("02-students without git repo", () => {
    // pozrite si strukturu objektov v poli a implementujte
    // zoznam studentov ktorym chyba git repo
    let missingGit = students.filter(({git}) => git == null ); //TODO: implement

    //debug(JSON.stringify(missingGit, null, 2));
    assert.deepStrictEqual(
      missingGit.map(({ name }) => name),
      ["Student 2", "Student 26"]
    )
  });

  function fixProjects(student) { 
    /*
    let {projects} = student
    return{
      ...student,
      projects: projects?projects.split(";")
      .map(s => s.trim())
      .filter(Boolean): []
    }
    
   */
   return {
    ...student,
    'projects':student["projects"] ? student["projects"].split(",").map(s => s.trim()).filter(Boolean) : []
   } 
  }

  it("03-students with better project structure", () => {
    // TODO: student.project is string delimited by ","
    // change ot to better structure []
    // split by semicolon, remove empty etc...
    // implementacia ma byt v reusable funkcii fixProjects
    // o par riadkov vyzsie 
    let students3 = students.map(fixProjects);

    //debug(JSON.stringify(students3, null, 2));
    students3.forEach(s => {
      assert(Array.isArray(s.projects), `failed for ${s["#"]}`);
    })
  });

  it("04-find students with less then 3 projects", () => {
    // na zaklade predoslej implementacie
    // by ste uz lahko mali najst studentov 
    // z menej ako 3ma projektami
    let students4 = students
      .map(fixProjects)
      .filter(student => student["projects"].length < 3)
      //.filter(({projects}) => projects.length < 3)
      
    // TODO:

    //debug(JSON.stringify(students4, null, 2));
    assert.deepStrictEqual(
      students4.map(s => s["#"]),
      [6, 7, 12, 21, 22, 24, 29, 35]
    )
  });


  function fixPoints(student) {
    return {
      ...student,
      points: Object.entries(student)
        .filter( ([key, _]) => key.match(/points\d+/g) )
        .map(([_, value]) => value)
    }
  }

  it("05-restructire points", () => {
    // body studentov su v zlej strukture
    // v properties z nazvami points1....pointsN
    // stransformujte [] studentov
    // tak aby kazdy student mal points:[] z hodnotami z pointsX properties
    // implementujte v metode fixPoints
    let studentsWithPoints = students
      .map(fixPoints)

    debug(studentsWithPoints)
    assert.deepStrictEqual(
      studentsWithPoints,
      require("./data/restructure-points.json")
    );

  });

  
  function totalPoints(student) {
    // TODO: implementujte
    return {
      ...student,
      totalPoints: student.points.reduce((acc, curr) => acc + curr)
    }
  }

  it("06-total points of each student", () => {
    // na zaklade finxutych pointov by ste teraz mali vediet
    // implementnut totalPoints
    // teda zratat sumu bodov za kazdeho studenta
    let studentsWithPoints = students
      .map(fixPoints)
      .map(totalPoints)

    studentsWithPoints.forEach(s => {
      debug(JSON.stringify(s, null, 2));
      assert.strictEqual(s.totalPoints, s.__totalPoints, `Fail for ${s["#"]}`);
    });

  });

  it("07-sum of points of all students", () => {
    // ak uz mate sumu za kazdeho jedneho, mali by ste vediet zrata
    // za vsetkych 
    const sumOfAll = students
      .map(fixPoints)
      .map(totalPoints)
      .reduce( (acc, {totalPoints} ) => acc + totalPoints, 0)


    debug(sumOfAll);
    assert(sumOfAll === 924);
  });

  it("08-unique list of projects", () => {
    // z celeho excelu chceme uniq zoznam projektov
    let uniqueProjects = students
      .map(fixProjects)
      .reduce((uniqueProjects, student, i, students) => {
        student.projects.forEach(uniqueProjects.add, uniqueProjects);
        return i !== students.length - 1 ? uniqueProjects : [...uniqueProjects];
      }, new Set())

    assert.deepStrictEqual(
      uniqueProjects,
      require("./data/unique-projects.json")
    );
  });


  it("09-group by project", () => {
    // ku kazdemu projektu najst zoznam studentov
    // vysledok ma vyzerat tak ako v group-by-project.json
    
    let groupedByProject = students
      .map(fixProjects)
      .reduce((uniqueProjects, student) => {
        student.projects.forEach(project => {
          let vals =  uniqueProjects.get(project);
          vals && vals.push(student) || uniqueProjects.set(project, [student])
        })
        return uniqueProjects
      }, new Map())
    // convert map entries to array
    groupedByProject = [...groupedByProject];
    
    //debug(JSON.stringify(groupedByProject, null, 2));
    assert.deepStrictEqual(
      groupedByProject,
      require("./data/group-by-project.json")
    );

  });

  it("10-projects with more students", () => {
    // chceme ku kazdemu projektu zoznam studentov
    // skuste to nejako kodnut tak
    // aby vysledok vysiel podla duplicate-projects.json
    const groupedProjectsMap = 
      students
      .map(fixProjects)
      .reduce((uniqueProjects, student) => {
        student.projects.filter(project => project !== '').forEach(project => {
          let vals =  uniqueProjects.get(project);
          vals && vals.push(student) || uniqueProjects.set(project, [student])
        })
        return uniqueProjects
      }, new Map())

    let duplicateProjects = [ ...groupedProjectsMap ]
      .map(([name, students]) => {
        return {
          "project": name,
          "students": students.map(s => s['#'])
        }
      })
      .filter(({students}) => students.length > 1)
      
    debug(JSON.stringify(duplicateProjects, null, 2));
    assert.deepStrictEqual(
      duplicateProjects,
      require("./data/duplicate-projects.json")
    );
  });
});