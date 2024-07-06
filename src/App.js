import React, { useState, useEffect } from 'react';
import './App.css';
import coursesData from './data.json';





function App() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    updateAvailableCourses();
  }, [selectedCourses]);

  const updateAvailableCourses = () => {
    const newAvailableCourses = coursesData.courses.filter(course => {
      if (selectedCourses.includes(course)) return false;
      return course.prerequisites.every(prerequisite =>
        selectedCourses.some(selected => selected.id === prerequisite)
      );
    });

    setAvailableCourses(newAvailableCourses);
  };

  const handleCourseSelection = (courseId) => {
    if (selectedCourses.some(course => course.id === courseId)) {
      setSelectedCourses(selectedCourses.filter(course => course.id !== courseId));
    } else {
      const selectedCourse = coursesData.courses.find(course => course.id === courseId);
      setSelectedCourses([...selectedCourses, selectedCourse]);
    }
  };

  const getClassNameForCourse = (courseId) => {
    if (selectedCourses.some(course => course.id === courseId)) {
      return 'course selected';
    }
    if (availableCourses.some(course => course.id === courseId)) {
      return 'course available';
    }
    return 'course';
  };

  const renderCoursesBySemester = (semester) => {
    return coursesData.courses
      .filter(course => course.semester === semester)
      .map(course => (
        <div
          key={course.id}
          className={getClassNameForCourse(course.id)}
          onClick={() => handleCourseSelection(course.id)}
        >
          {course.name}
        </div>
      ));
  };

  const semesters = [...new Set(coursesData.courses.map(course => course.semester))].sort((a, b) => a - b);
  const years = Array.from(new Set(semesters.map(semester => Math.ceil(semester / 2))));

  return (
    <div className="App">
      <h1>Malla Interactiva Ingeniería Civil Física</h1>
      <div className="course-container">
        <div className="sticky-header">
          <div className="year-row">
            {years.map((year, index) => {
              const yearSemesters = semesters.filter(semester => Math.ceil(semester / 2) === year);
              return (
                <div
                  key={index}
                  className="year"
                  style={{ gridColumn: `span ${yearSemesters.length}` }}
                >
                  Año {year}
                </div>
              );
            })}
          </div>
          <div className="semester-row">
            {semesters.map(semester => (
              <div key={semester} className="semester-header">Semestre {semester}</div>
            ))}
          </div>
        </div>
        <div className="courses-grid">
          {semesters.map(semester => (
            <div key={semester} className="semester">
              {renderCoursesBySemester(semester)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
