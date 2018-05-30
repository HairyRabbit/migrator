pipeline {
  agent any
  stages {
    stage('install') {
      steps {
        sh 'npm i'
      }
    }
    stage('test') {
      parallel {
        stage('test') {
          steps {
            sh 'npm run test'
          }
        }
        stage('type') {
          steps {
            sh 'npm run type'
          }
        }
      }
    }
    stage('build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}