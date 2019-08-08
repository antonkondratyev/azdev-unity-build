#!/bin/bash

Time() {
    sec=$SECONDS
    ((h=$sec/3600))
    ((m=($sec%3600)/60))
    ((s=$sec%60))
    printf "Time: %02d:%02d:%02d ($sec seconds)\n" $h $m $s
}

Header() {
    echo "------------------------------------------------------------"
    echo "  ${1} ${2} ${3} ${4} ${5}"
    echo "------------------------------------------------------------"
}

colored() {
    case ${1} in
        "red") echo -en "\033[1;31m${2}\033[0m";;
        "bold") echo -en "\033[1m${2}\033[0m";;
        "dark") echo -en "\033[1;30m";;
        "clean") echo -en "\033[0m";;
    esac
}

GetUnityInstances() {
    local arr=()
    local maxVersion=0
    local latestUnity=""

    for instance in $(find /Applications/* -name "Unity.app" -type d -maxdepth 1); do
        local version=$(/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" $instance/Contents/Info.plist)
        local path="$instance/Contents/MacOS/Unity"

        local currentNumVer=$(GetNumVersion $version)
        if [[ $currentNumVer -gt $maxVersion ]]; then
            maxVersion=$currentNumVer
            latestUnity="unity=$path"
        fi

        arr+=("unity_$version=$path")
    done
    arr+=($latestUnity)

    echo ${arr[*]}
}

GetNumVersion() {
    echo $1 | sed -e 's/a/1/g' -e 's/b/2/g' -e 's/f/3/g' -e 's/p/4/g' | awk -F '\.' '{
        $2=sprintf("%03\d", $2)
        $3=sprintf("%04\d", $3)
        print $1,$2,$3
    }' | sed -e 's/ //g'
}

GetAgents() {
    echo $(ps -A | awk -v pattern='/bin/Agent.Listener' '$4 ~ pattern { sub(pattern, ""); print $4 }')
}

PrintFile() {
    local fileContent=$(cat $1)

    for line in ${fileContent[*]}; do
        echo $line
    done
}

RestartAgent() {
    echo "Agent restarting..."

    colored dark
    pushd $1 >/dev/null

    if $DEBUG; then
        echo
        ./svc.sh stop
        ./svc.sh start
    else
        ./svc.sh stop >/dev/null
        ./svc.sh start >/dev/null
    fi

    popd >/dev/null
    colored clean

    echo "Agent restarted."
}

ResetAgentEnv() {
    echo "Environment file reseting..."

    colored dark
    pushd $1 >/dev/null

    local envFile="$1/.env"

    if $DEBUG; then
        echo -n "  Remove: "
        rm -fv $envFile

        echo "  Create: $envFile"
        ./env.sh
    else
        rm -f $envFile
        ./env.sh
    fi

    popd >/dev/null
    colored clean

    echo "Environment file reseted."
    echo
}

GetAgentName() {
    echo $(cat $1/.agent | grep -iw agentName | awk -F "\"" '{ print $4 }')
}

GetAgentEnvs() {
    echo "Environment Variables:"
    colored dark

    PrintFile $1

    colored clean
    echo
}

SetAgentEnvs() {
    local envFileContent=$(cat $1)

    for unityVar in $unityVars; do
        if [[ ! ${envFileContent[*]} == *$unityVar* ]]; then
            # Adding new lines in .env file
            echo $unityVar >>$1
            needRestart=true
        fi
    done
}

AddAgentUnityVars() {
    for agentDir in ${agentDirs[*]}; do
        Header "$(colored bold $(GetAgentName $agentDir))"

        local needRestart=false
        local envFilePath="$agentDir/.env"

        if $RESET; then
            ResetAgentEnv $agentDir
        fi

        if $DEBUG; then
            GetAgentEnvs $envFilePath
        fi

        SetAgentEnvs $envFilePath

        if $needRestart; then
            RestartAgent $agentDir
            echo
        else
            echo "No need to restart."
            echo
        fi
    done
}

CreateAliases() {
    if $RESET; then
        rm -f /usr/local/bin/unity*
    fi

    for unity in $unityVars; do
        local version=$(echo $unity | awk -F '=' '{ print $1 }')
        local path=$(echo $unity | awk -F '=' '{ print $2 }')
        local aliasFile="/usr/local/bin/$version"

        touch $aliasFile
        chmod +x $aliasFile
        echo "$path \$@">$aliasFile
    done
}

Run() {
    unityVars=$(GetUnityInstances)
    agentDirs=($(GetAgents))

    if [[ ${#agentDirs[*]} -eq 0 ]]; then
        echo "VSTS-Agents not runned."
        exit 0
    fi

    clear
    AddAgentUnityVars
    CreateAliases

    echo -e "\033[1;30mRun $(Time)\033[0m\n"
}

Help() {
    echo
    echo -e " This script finds all instances of Unity and creates environment variables for runned VSTS-Agent"
    echo
    echo -e ' Usage:'
    echo -e "  $0 [ help, reset, debug ]"
    echo
    echo -e " Arguments:"
    echo -e "  $(colored bold reset)\t\t Recreate .env file in agent folder"
    echo -e "  $(colored bold debug)\t\t Debug info"
    echo
}

DEBUG=false
if [[ $@ == *"debug"* ]]; then DEBUG=true; fi

RESET=false
if [[ $@ == *"reset"* ]]; then RESET=true; fi

case $1 in
   "help") Help;;
   *) Run;;
esac

exit 0