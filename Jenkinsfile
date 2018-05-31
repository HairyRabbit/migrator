pipeline {
  agent any
  environment {
    CI = 'true'
    NODE_ENV = 'test'
  }
  stages {
    stage('install') {
      parallel {
        stage('install dependencies') {
          steps {
            sh 'npm ci --verbose'
          }
        }
        stage('install types') {
          steps {
            sh 'flow-typed install --verbose'
          }
        }
      }
    }
    stage('build') {
      steps {
        sh 'npm run build'
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
  }
}
