pipeline {
  agent any
  stages {
    stage('install') {
      parallel {
        stage('install dependencies') {
          steps {
            sh 'npm i --verbose'
          }
        }
        stage('install types') {
          steps {
            sh 'flow-typed install --verbose'
          }
        }
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