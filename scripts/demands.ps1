if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

if (!([System.Environment]::OSVersion.Platform -eq "Win32NT")) {
    "Windows only!"
    exit
}

class Unity {
    [string]$Path = ""
    [string]$Version = ""
    [int]$VersionInt = 0
}

function Get-EnvVariable() {
    param($pattern, $target)
    [Environment]::GetEnvironmentVariables($target).GetEnumerator().where({ $_.key -like $pattern })
}

function Set-EnvVariable() {
    param($name, $value, $target)
    [Environment]::SetEnvironmentVariable($name, $value, $target)
}

function Remove-UnityEnvVariables() {
    $unityVars = Get-EnvVariable -pattern "unity_*" -target "Machine"
    
    foreach ($unityVar in $unityVars) {
        if (!(Test-Path $unityVar.Value)) {
            Set-EnvVariable -name $unityVar.Key -value $null -target "Machine"
        }
    }
}

function Get-PadVersion($unityVersions) {
    $unityVersions.foreach({ [string]::Join("", $_.Replace("a", "1").Replace("b", "2").Replace("f", "3").Replace("p", "4").Split(".").PadLeft(3, '0')) })
}

function Get-UnityInstances() {
    $unityList = New-Object System.Collections.ArrayList
    $unityAppList = Get-ChildItem -Path (Get-Item env:ProgramFiles).Value -Filter "Unity.exe" -Recurse


    foreach ($unityApp in $unityAppList) {
        [XML]$xml = Get-Content (Get-ChildItem -Path ([IO.Path]::Combine($unityApp.DirectoryName, "Data", "PackageManager")) -Filter *.xml -Recurse).FullName

        $unity = New-Object Unity
        $unity.Path = $unityApp.FullName
        $unity.Version = $xml | Select-Xml -XPath "//info" | ForEach-Object { $_.node.unityVersion }
        $unity.VersionInt = Get-PadVersion($unity.Version)

        $unityList.Add($unity) | Out-Null
    }

    return $unityList
}

function Get-LatestVersion([Array]$versionList) {
    ($versionList | Measure-Object -Max).Maximum
}

function Set-UnityEnvVariables($unityList) {
    $unityVersionMax = Get-LatestVersion($unityList.VersionInt)

    foreach ($unity in $unityList | Sort-Object { $_.VersionInt }) {
        Set-EnvVariable -name ("unity_" + $unity.Version) -value $unity.Path -target ([EnvironmentVariableTarget]::Machine)
        "['unity_$($unity.Version)'] = $($unity.Path)"

        if ($unityVersionMax -eq $unity.VersionInt) {
            Set-EnvVariable -name "unity" -value $unity.Path -target "Machine"
            "['unity'] = $($unity.Path)"
        }
    }
}

$sw = [Diagnostics.Stopwatch]::StartNew()

# Removing env vars if Unity.exe doesn't exist anymore
Remove-UnityEnvVariables

$unityList = Get-UnityInstances
Set-UnityEnvVariables($unityList)

$sw.Stop()
"`nRunTime: $($sw.Elapsed.ToString('hh\:mm\:ss\.fff'))"