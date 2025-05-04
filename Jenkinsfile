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
                dir('hnnt-chat-server') {
                    sh '''
                        # Ensure nvm is installed and available
                        export NVM_DIR="$HOME/.nvm"
                        if [ ! -s "$NVM_DIR/nvm.sh" ]; then
                            echo "nvm not found, installing..."
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
                            . "$NVM_DIR/nvm.sh"
                        else
                            . "$NVM_DIR/nvm.sh"
                        fi

                        # Set up Node.js
                        nvm install ${NODE_VERSION}
                        nvm use ${NODE_VERSION}

                        # Check if package.json exists
                        if [ ! -f package.json ]; then
                            echo "Error: package.json not found in hnnt-chat-server directory."
                            exit 1
                        fi

                        # Install dependencies
                        npm install
                    '''
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Test Server') {
                    steps {
                        echo 'Running tests for hnnt-chat-server...'
                        dir('hnnt-chat-server') {
                            sh '''
                                # Ensure nvm is installed and available
                                export NVM_DIR="$HOME/.nvm"
                                . "$NVM_DIR/nvm.sh"

                                # Set up Node.js
                                nvm use ${NODE_VERSION}
                                npm test
                            '''
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
        //                         sh '''
        //                             # Set up Node.js
        //                             . ~/.nvm/nvm.sh
        //                             nvm use ${NODE_VERSION}
        //                             npm run build
        //                         '''
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
        //                         sh '''
        //                             # Set up Node.js
        //                             . ~/.nvm/nvm.sh
        //                             nvm use ${NODE_VERSION}
        //                             npm run build
        //                         '''
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
        //                             sh '''
        //                                 # Set up Node.js
        //                                 . ~/.nvm/nvm.sh
        //                                 nvm use ${NODE_VERSION}
        //                                 npm run deploy
        //                             '''
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
        //                         sh '''
        //                             # Set up Node.js
        //                             . ~/.nvm/nvm.sh
        //                             nvm use ${NODE_VERSION}
        //                             npm install
        //                             pm2 restart server.js || pm2 start server.js
        //                         '''
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
