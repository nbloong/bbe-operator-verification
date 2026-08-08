# BBE Operator Verification

Static GitHub Pages site for read-only site verification of authorised equipment operators.

## Current module

- Overhead Crane (LM) Operator Verification
- 7 operators loaded
- Search by BBE internal ID, name or certificate number
- Direct individual links such as `?id=BBE-LM-004`
- Automatic expiry check from the recorded valid-until date
- Manual blocking statuses supported through `manualStatus` in `data/operators.json`

## Enable GitHub Pages

1. Open this repository in GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**.
5. Save.
6. The site will be available at:
   `https://nbloong.github.io/bbe-operator-verification/`

## Direct operator example

`https://nbloong.github.io/bbe-operator-verification/?id=BBE-LM-004`

This should show only Islam Jobayer's verification record.

## Training-card images

The webpage expects these files:

- `cards/BBE-LM-001.jpg`
- `cards/BBE-LM-002.jpg`
- `cards/BBE-LM-003.jpg`
- `cards/BBE-LM-004.jpg`
- `cards/BBE-LM-005.jpg`
- `cards/BBE-LM-006.jpg`
- `cards/BBE-LM-007.jpg`

If an image has not yet been uploaded, the verification page displays `Training card image pending upload` while the operator record remains available.

## Updating an operator

Edit `data/operators.json`. The fields used are:

- `id`
- `name`
- `role`
- `training`
- `certificateNo`
- `trainingDate`
- `expiryDate`
- `site`
- `manualStatus`
- `cardImage`

Leave `manualStatus` blank for automatic validity based on the expiry date. To immediately stop an operator from showing as cleared, set it to values such as `SUSPENDED`, `NOT AUTHORISED`, `INACTIVE`, or `VOID`.
