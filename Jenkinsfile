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
                cache(path: 'node_modules', key: 'npm-${env.NODE_VERSION}') {
                    nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                // stage('Test Web') {
                //     steps {
                //         echo 'Running tests for hnnt-chat-web...'
                //         dir('hnnt-chat-web') {
                //             nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                //                 sh 'npm test'
                //             }
                //         }
                //     }
                // }
                // stage('Test Mobile') {
                //     steps {
                //         echo 'Running tests for hnnt-chat-mobile...'
                //         dir('hnnt-chat-mobile') {
                //             sh './gradlew test'
                //         }
                //     }
                // }
                stage('Test Server') {
                    steps {
                        echo 'Running tests for hnnt-chat-server...'
                        dir('hnnt-chat-server') {
                            nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
                                sh 'npm test'
                            }
                        }
                    }
                }
            }
        }

    //     stage('Build') {
    //         parallel {
    //             stage('Build Web') {
    //                 steps {
    //                     echo 'Building hnnt-chat-web...'
    //                     dir('hnnt-chat-web') {
    //                         nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
    //                             sh 'npm run build'
    //                         }
    //                     }
    //                 }
    //             }
    //             stage('Build Mobile') {
    //                 steps {
    //                     echo 'Building hnnt-chat-mobile...'
    //                     dir('hnnt-chat-mobile') {
    //                         sh './gradlew clean assembleRelease'
    //                     }
    //                 }
    //             }
    //             stage('Build Server') {
    //                 steps {
    //                     echo 'Building hnnt-chat-server...'
    //                     dir('hnnt-chat-server') {
    //                         nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
    //                             sh 'npm run build'
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     stage('Deploy') {
    //         when {
    //             expression { params.ENV == 'prod' }
    //         }
    //         parallel {
    //             stage('Deploy Web') {
    //                 steps {
    //                     echo 'Deploying hnnt-chat-web...'
    //                     dir('hnnt-chat-web') {
    //                         withCredentials([string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')]) {
    //                             sh 'echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc'
    //                             sh 'npm run deploy'
    //                         }
    //                     }
    //                 }
    //             }
    //             stage('Deploy Mobile') {
    //                 steps {
    //                     echo 'Deploying hnnt-chat-mobile...'
    //                     dir('hnnt-chat-mobile') {
    //                         sh 'fastlane deploy'
    //                     }
    //                 }
    //             }
    //             stage('Deploy Server') {
    //                 steps {
    //                     echo 'Deploying hnnt-chat-server...'
    //                     dir('hnnt-chat-server') {
    //                         nodejs(nodeJSInstallationName: "Node ${env.NODE_VERSION}") {
    //                             sh 'npm install'
    //                             sh 'pm2 restart server.js || pm2 start server.js'
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
