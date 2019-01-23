const readline = require('readline');
const Table = require('cli-table');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('university.db');

var user = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout

});

// instantiate
let table = null


function askUsername() {
  rl.question(`username:`, (username) => {
    db.all(`select * from users where username = '${username}'`, (err, rows) => {
      if (rows.length > 0) {
        askPassword(username);
      } else {
        console.log(`username doesn't exist`);
        askUsername();
      }
    })
  });
}

function askPassword(username) {
  rl.question(`password:`, (password) => {
    db.all(`select * from users where username = '${username}' and pass='${password}'`, (err, rows) => {
      if (rows.length > 0) {
        user = rows[0];
        mainMenu();
      } else {
        console.log(`password is wrong`);
        askPassword();
      }
    })
  });
}

console.log(`===============================================
Welcome to Oxford University, Oxford OX1 2JD, UK`);
askUsername()
//mainMenu();

function mainMenu() {
  console.log(`===============================================
Welcome, ${user.username}. your access level is : ${user.role}
===============================================`);
  console.log(`Please choose the option below:
[1] Student
[2] Major
[3] Lecturer
[4] Courses
[5] Contract
[6] Exit
================================================`);
  rl.question(`Please choose one of the options above:`, (answer) => {
    switch (answer) {
      case '1':
        studentMenu();
        break;
      case '2':
        majorMenu();
        break;
      case '3':
        lecturerMenu();
        break;
      case '4':
        coursesMenu();
        break;
      case '5':
        contractMenu();
        break;
      case '6':
        db.close();
        process.exit(0);

        break;
      default:
        console.log('you input the wrong number');
        mainMenu();
        break;
    }
  });
}


function studentMenu() {
  console.log(`Please choose the option below:
[1] Student list
[2] find student
[3] add  student
[4] delete student
[5] back`);
  rl.question(`Please choose one of the options above:`, (answer) => {
    switch (answer) {
      case '1':
        studentLIst()
        break;
      case '2':
        findStudent()
        break;
      case '3':
        addStudent()
        break;
      case '4':
        deleteStudent()
        break;
      case '5':
        mainMenu();
        break;
      default:
        console.log('you input the wrong number');
        studentMenu();
        break;
    }
  });
};

function studentLIst() {
  db.all('select * from mahasiswa', (err, rows) => {

    table = new Table({
      head: ['NIM', 'Name', 'Address', 'Major'],
      colWidths: [5, 20, 20, 18]
    });

    rows.forEach((item) => {
      table.push([item.nim, item.first_name, item.addres, item.nama_jurusan]);
    })
    console.log(table.toString());
    studentMenu();
  })

};

function findStudent() {
  rl.question(`Masukkan NIM:`, (answer) => {
    db.all(`select nim, first_name, addres, nama_jurusan from mahasiswa where mahasiswa.nim = '${answer}'`, (err, rows) => {
      if (rows.length > 0) {
        console.log(`==================================
        Student details
        ==================================
        NIM      : ${rows[0].nim}
        Name     : ${rows[0].first_name} 
        Address  : ${rows[0].addres}
        Major    : ${rows[0].nama_jurusan}
        ==================================`);
        studentMenu()
      } else {
        console.log(`Student's NIM ${answer} is unlisted`);
        findStudent()
      }
    })
  })
};

function addStudent() {
  console.log(`Please complete the data below :`);

  rl.question(`NIM:`, (nim) => {

    rl.question(`Name:`, (name) => {

      rl.question(`Address:`, (address) => {

        rl.question(`Major:`, (major) => {
          //  let apaAja = `insert into mahasiswa(nim, first_name, addres, umur) values('${nim}','${name}','${address}',${age})`;
          //let sql = `insert into mahasiswa(nim, first_name, addres, nama_jurusan) values('${nim}','${name}','${address}',${major})`;

          db.run(`insert into mahasiswa(nim, first_name, addres, nama_jurusan) values('${nim}','${name}','${address}','${major}')`, (err) => {
            //console.log(apaAja);
            db.all('select * from mahasiswa', (err, rows) => {

              table = new Table({
                head: ['NIM', 'Name', 'Address', 'Major'],
                colWidths: [5, 20, 20, 18]
              });

              rows.forEach((item) => {
                table.push([item.nim, item.first_name, item.addres, item.nama_jurusan]);
              });

              console.log(table.toString());
              studentMenu();
            });
          })
        });
      });
    });
  });
}

function deleteStudent() {

  rl.question(`NIM mahasiswa yang akan dihapus:`, (nim) => {
    console.log(`Mahasiswa dengan NIM: ${nim} telah dihapus `);
    db.run(`delete from mahasiswa where nim = '${nim}'`, (err) => {

      db.all('select * from mahasiswa', (err, rows) => {

        table = new Table({
          head: ['NIM', 'Name', 'Address', 'Major'],
          colWidths: [5, 20, 20, 18]
        });

        rows.forEach((item) => {
          table.push([item.nim, item.first_name, item.addres, item.nama_jurusan]);

        });

        console.log(table.toString());
        studentMenu();
      });
    });
  });
};

function majorMenu() {
  console.log(`Please choose the option below:
[1] Major list
[2] find major
[3] add  major
[4] delete major
[5] back`);
  rl.question(`Please choose one of the options above:`, (answer) => {
    switch (answer) {
      case '1':
        majorLIst()
        break;
      case '2':
        findMajor()
        break;
      case '3':
        addMajor()
        break;
      case '4':
        deleteMajor()
        break;
      case '5':
        mainMenu();
        break;
      default:
        console.log('you input wrong number');
        majorMenu();
        break;
    }
  });
};

function majorLIst() {
  db.all('select * from jurusan', (err, rows) => {

    table = new Table({
      head: ['Major Code', 'Major Name'],
      colWidths: [7, 20]
    });

    rows.forEach((item) => {
      table.push([item.kode_jurusan, item.nama_jurusan]);
    })
    console.log(table.toString());
    majorMenu();
  })
};

function findMajor() {
  rl.question(`Masukkan Kode Jurusan:`, (answer) => {
    db.all(`select * from jurusan where jurusan.kode_jurusan = '${answer}'`, (err, rows) => {
      if (rows.length > 0) {
        console.log(`==================================
        Major details
        ==================================
        
        Major Code  : ${rows[0].kode_jurusan}
        Major       : ${rows[0].nama_jurusan} 

        ==================================`);
        majorMenu()
      } else {
        console.log(`Major code ${answer} is unlisted`);
        findMajor()
      }
    })
  })
};

function addMajor() {
  console.log(`Please complete the data below :`);

  rl.question(`Major Code:`, (code) => {

    rl.question(`Major:`, (major) => {

      db.run(`insert into jurusan (kode_jurusan, nama_jurusan) values('${code}','${major}')`, (err) => {

        db.all('select * from jurusan', (err, rows) => {

          table = new Table({
            head: ['Major Code', 'Major Name'],
            colWidths: [7, 20]
          });

          rows.forEach((item) => {
            table.push([item.kode_jurusan, item.nama_jurusan]);

          });

          console.log(table.toString());
          majorMenu();
        });
      });
    });
  });
};

function deleteMajor() {

  rl.question(`Kode jurusan yang akan dihapus:`, (code) => {
    console.log(`Kode jurusan dengan nomor: ${code} telah dihapus `);
    db.run(`delete from jurusan where kode_jurusan = '${code}'`, (err) => {

      db.all('select * from jurusan', (err, rows) => {

        table = new Table({
          head: ['Major Code', 'Major Name'],
          colWidths: [7, 20]
        });

        rows.forEach((item) => {
          table.push([item.kode_jurusan, item.nama_jurusan]);

        });

        console.log(table.toString());
        majorMenu();
      });
    });
  });
};

function lecturerMenu() {
  console.log(`Please choose the option below:
[1] Lecturer list
[2] find lecturer
[3] add  lecturer
[4] delete lecturer
[5] back`);
  rl.question(`Please choose one of the options above:`, (answer) => {
    switch (answer) {
      case '1':
        lecturerLIst()
        break;
      case '2':
        findLecturer()
        break;
      case '3':
        addLecturer()
        break;
      case '4':
        deleteLecturer()
        break;
      case '5':
        mainMenu();
        break;
      default:
        console.log('you input the wrong number');
        lecturerMenu();
        break;
    }
  });
};

function lecturerLIst() {
  db.all('select * from dosen', (err, rows) => {

    table = new Table({
      head: ['ID', 'First Name'],
      colWidths: [5, 20]
    });

    rows.forEach((item) => {
      table.push([item.id_dosen, item.first_name]);
    })
    console.log(table.toString());
    lecturerMenu();
  })
};

function findLecturer() {
  rl.question(`Masukkan ID Dosen:`, (answer) => {
    db.all(`select id_dosen, first_name from dosen where dosen.id_dosen = '${answer}'`, (err, rows) => {
      if (rows.length > 0) {
        console.log(`==================================
        Major details
        ==================================
        
        ID     : ${rows[0].id_dosen}
        Name   : ${rows[0].first_name} 

        ==================================`);
        lecturerMenu()
      } else {
        console.log(`Lecturer ID ${answer} is unlisted`);
        findLecturer()
      }
    })
  })
};

function addLecturer() {
  console.log(`Please complete the data below :`);

  rl.question(`ID:`, (id) => {

    rl.question(`Name:`, (name) => {

      db.run(`insert into dosen (id_dosen, first_name) values('${id}','${name}')`, (err) => {
        //console.log(apaAja);
        db.all('select * from dosen', (err, rows) => {

          table = new Table({
            head: ['ID', 'Name'],
            colWidths: [5, 20]
          });

          rows.forEach((item) => {
            table.push([item.id_dosen, item.first_name])
          });

          console.log(table.toString());
          lecturerMenu();
        });
      });
    });
  });
};

function deleteLecturer() {

  rl.question(`ID Dosen yang akan dihapus:`, (code) => {
    console.log(`ID Dosen dengan nomor: ${code} telah dihapus `);
    db.run(`delete from dosen where id_dosen = '${code}'`, (err) => {

      db.all('select * from dosen', (err, rows) => {

        table = new Table({
          head: ['ID', 'First Name'],
          colWidths: [5, 20]
        });

        rows.forEach((item) => {
          table.push([item.id_dosen, item.first_name]);

        });

        console.log(table.toString());
        lecturerMenu();
      });
    });
  });
};

function coursesMenu() {
  console.log(`Please choose the option below:
[1] Courses list
[2] find course
[3] add  course
[4] delete course
[5] back`);
  rl.question(`Please choose one of the options above:`, (answer) => {
    switch (answer) {
      case '1':
        coursesLIst()
        break;
      case '2':
        findCourse()
        break;
      case '3':
        addCourse()
        break;
      case '4':
        deleteCourse()
        break;
      case '5':
        mainMenu();
        break;
      default:
        console.log('you input the wrong number');
        studentMenu();
        break;
    }
  });
};

function coursesLIst() {
  db.all('select * from mata_kuliah', (err, rows) => {

    table = new Table({
      head: ['Course Code', 'Course Name', 'Credits'],
      colWidths: [12, 20, 7]
    });

    rows.forEach((item) => {
      table.push([item.kode_mata_kuliah, item.nama, item.sks]);
    })
    console.log(table.toString());
    coursesMenu();
  })
};

function findCourse() {
  rl.question(`Masukkan kode mata kuliah:`, (answer) => {
    db.all(`select * from mata_kuliah where mata_kuliah.kode_mata_kuliah = '${answer}'`, (err, rows) => {
      if (rows.length > 0) {
        console.log(`==================================
        Course details
        ==================================
        
        Course Code  : ${rows[0].kode_mata_kuliah}
        Course       : ${rows[0].nama} 
        Credit       : ${rows[0].sks}

        ==================================`);
        coursesMenu();
      } else {
        console.log(`Course code ${answer} is unlisted`);
        findCourse();
      }
    });
  });
};

function addCourse() {
  console.log(`Please complete the data below :`);

  rl.question(`Course_Code:`, (coursecode) => {

    rl.question(`Course:`, (course) => {

      rl.question(`Credit:`, (credit) => {

        db.run(`insert into mata_kuliah (kode_mata_kuliah, nama, sks) values('${coursecode}','${course}','${credit}')`, (err) => {
          //console.log(apaAja);
          db.all('select * from mata_kuliah', (err, rows) => {

            table = new Table({
              head: ['Course Code', 'Course', 'Credit'],
              colWidths: [12, 20, 8]
            });

            rows.forEach((item) => {
              table.push([item.kode_mata_kuliah, item.nama, item.sks])
            });

            console.log(table.toString());
            coursesMenu();
          });
        });
      });
    });
  });
};

function deleteCourse() {

  rl.question(`Kode mata kuliah yang akan dihapus:`, (code) => {
    console.log(`Kode mata kuliah dengan nomor: ${code} telah dihapus `);
    db.run(`delete from mata_kuliah where kode_mata_kuliah = '${code}'`, (err) => {

      db.all('select * from mata_kuliah', (err, rows) => {

        table = new Table({
          head: ['Course Code', 'Course', 'Credit'],
          colWidths: [12, 20, 8]
        });

        rows.forEach((item) => {
          table.push([item.kode_mata_kuliah, item.nama, item.sks]);

        });

        console.log(table.toString());
        coursesMenu();
      });
    });
  });
};

function contractMenu() {
  console.log(`Please choose the option below:
[1] Contract list
[2] find contract
[3] add contract
[4] delete contract
[5] back`);
  rl.question(`Please choose one of the options above:`, (answer) => {
    switch (answer) {
      case '1':
        contractLIst()
        break;
      case '2':
        findContract()
        break;
      case '3':
        addContract()
        break;
      case '4':
        deleteContract()
        break;
      case '5':
        mainMenu();
        break;
      default:
        console.log('you input the wrong number');
        studentMenu();
        break;
    }
  });
};

function contractLIst() {
  db.all('select * from kontrak', (err, rows) => {

    table = new Table({
      head: ['Contract ID', 'NIM', 'ID Dosen', 'Kode Mata Kuliah', 'Nilai'],
      colWidths: [7, 7, 7, 10, 7]
    });

    rows.forEach((item) => {
      table.push([item.id_kontrak, item.nim, item.id_dosen, item.kode_mata_kuliah, item.nilai]);
    })
    console.log(table.toString());
    contractMenu();
  })
};

function findContract() {
  rl.question(`Masukkan ID kontrak:`, (answer) => {
    db.all(`select * from kontrak where kontrak.id_kontrak = ${answer}`, (err, rows) => {
      if (rows.length > 0) {
        console.log(`==================================
        Contract details
        ==================================
        
        Contract ID  : ${rows[0].id_kontrak}
        NIM          : ${rows[0].nim} 
        Lecturer ID  : ${rows[0].id_dosen}
        Course Code  : ${rows[0].kode_mata_kuliah}
        Grade        : ${rows[0].nilai}
        
        ==================================`);
        contractMenu();
      } else {
        console.log(`Course code ${answer} is unlisted`);
        findContract();
      }
    });
  });
};

function addContract() {
  console.log(`Please complete the data below :`);

  rl.question(`Contract_ID:`, (contractid) => {

    rl.question(`NIM:`, (nim) => {

      rl.question(`Lecturer_ID:`, (lecturerid) => {

        rl.question(`Course Code:`, (coursecode) => {

          rl.question(`Grade:`, (grade) => {

            db.run(`insert into kontrak (id_kontrak, nim, id_dosen, kode_mata_kuliah, nilai) values(${contractid},'${nim}','${lecturerid}', '${coursecode}', '${grade}')`, (err) => {

              db.all('select * from kontrak', (err, rows) => {

                table = new Table({
                  head: ['Contract ID', 'NIM', 'ID Dosen', 'Kode Mata Kuliah', 'Nilai'],
                  colWidths: [7, 7, 7, 10, 7]
                });

                rows.forEach((item) => {
                  table.push([item.id_kontrak, item.nim, item.id_dosen, item.kode_mata_kuliah, item.nilai])
                });

                console.log(table.toString());
                contractMenu();
              });
            });
          });
        });
      });
    });
  });
};

function deleteContract() {

  rl.question(`ID kontrak yang akan dihapus:`, (code) => {
    console.log(`ID kontrak dengan nomor: ${code} telah dihapus `);
    db.run(`delete from kontrak where id_kontrak = '${code}'`, (err) => {

      db.all('select * from kontrak', (err, rows) => {

        table = new Table({
          head: ['Contract ID', 'NIM', 'ID Dosen', 'Kode Mata Kuliah', 'Nilai'],
          colWidths: [7, 7, 7, 10, 7]
        });

        rows.forEach((item) => {
          table.push([item.id_kontrak, item.nim, item.id_dosen, item.kode_mata_kuliah, item.nilai]);

        });

        console.log(table.toString());
        contractMenu();
      });
    });
  });
};