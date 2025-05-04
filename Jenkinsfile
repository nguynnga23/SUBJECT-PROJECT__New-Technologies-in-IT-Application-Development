pipeline {
    agent any

    environment {
        NODE_VERSION = '16'
    }

    parameters {
        choice(name: 'ENV', choices: ['dev', 'staging', 'prod'], description: 'Target environment')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        echo 'Running tests...'
                        nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                            sh 'npm test'
                        }
                    } catch (Exception e) {
                        echo "Tests failed: ${e.message}"
                        error("Test stage failed")
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Web') {
                    steps {
                        echo 'Building the web project...'
                        dir('hnnt-chat-web') {
                            nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                                sh 'npm run build'
                            }
                        }
                    }
                }
                stage('Build Mobile') {
                    steps {
                        echo 'Building the mobile project...'
                        dir('hnnt-chat-mobile') {
                            sh './gradlew clean assembleRelease'
                        }
                    }
                }
            }
        }

        stage('Deploy Web') {
            when {
                expression { params.ENV == 'prod' }
            }
            steps {
                echo "Deploying web to ${params.ENV}..."
                withCredentials([string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')]) {
                    dir('hnnt-chat-web') {
                        nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                            sh 'echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc'
                            sh 'npm run deploy'
                        }
                    }
                }
            }
        }

        stage('Deploy Mobile') {
            when {
                expression { params.ENV == 'prod' }
            }
            steps {
                echo "Deploying mobile to ${params.ENV}..."
                dir('hnnt-chat-mobile') {
                    sh 'fastlane deploy' // Replace with actual deployment command
                }
            }
        }

        stage('Deploy Server') {
            when {
                expression { params.ENV == 'prod' }
            }
            steps {
                echo "Deploying server to ${params.ENV}..."
                dir('server') {
                    nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                        sh 'npm install'
                        sh 'pm2 restart server.js || pm2 start server.js'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'hnnt-chat-web/dist/**,hnnt-chat-mobile/app/build/outputs/apk/**', allowEmptyArchive: true
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            slackSend(channel: '#ci', message: 'Build succeeded for hnnt-chat!')
        }
        failure {
            echo 'Pipeline failed!'
            slackSend(channel: '#ci', message: 'Build failed for hnnt-chat!')
        }
    }
}